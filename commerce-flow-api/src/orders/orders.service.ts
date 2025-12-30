import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { S3Service } from '../s3/s3.service';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private readonly httpService: HttpService,
    @InjectQueue('notificacao') private notificacaoQueue: Queue,
    private readonly s3Service: S3Service,
  ) {}

  async getExchangeRate(): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://economia.awesomeapi.com.br/json/last/USD-BRL', {
          timeout: 5000, // 5 segundos timeout
        }),
      );

      // Validação da resposta
      if (!response.data || !response.data.USDBRL) {
        throw new Error('Invalid API response format');
      }

      const rate = parseFloat(response.data.USDBRL.bid);

      if (isNaN(rate) || rate <= 0) {
        throw new Error('Invalid exchange rate value');
      }

      console.log(`💱 Taxa de câmbio obtida: USD 1.00 = BRL ${rate.toFixed(4)}`);

      return rate;
    } catch (error) {
      console.error('❌ Erro ao buscar taxa de câmbio:', error.message);

      // Fallback: taxa aproximada em caso de falha da API
      const fallbackRate = 5.50;
      console.warn(`⚠️  Usando taxa de fallback: USD 1.00 = BRL ${fallbackRate.toFixed(4)}`);

      return fallbackRate;
    }
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customer = await this.customerModel.findById(createOrderDto.customerId).exec();
    if (!customer) {
      throw new Error('Customer not found');
    }

    const rate = await this.getExchangeRate();
    const valorTotalUSD = createOrderDto.items.reduce(
      (total, item) => total + item.quantity * item.precoUnitarioUSD,
      0,
    );
    const valorTotalBRL = valorTotalUSD * rate;

    const orderData = {
      ...createOrderDto,
      date: new Date(createOrderDto.date),
      valorTotalUSD,
      valorTotalBRL,
    };

    const savedOrder = await this.orderModel.create(orderData);

    await this.notificacaoQueue.add({
      orderId: savedOrder._id,
      customerName: customer.name,
      customerEmail: customer.email,
    });

    console.log(`✅ Pedido criado com sucesso! Valor USD: $${valorTotalUSD.toFixed(2)}, Valor BRL: R$${valorTotalBRL.toFixed(2)}`);

    return savedOrder;
  }

  async findAll(page?: number, limit?: number): Promise<Order[]> {
    const query = this.orderModel.find();
    if (page && limit) {
      query.skip((page - 1) * limit).limit(limit);
    }
    return query.exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }

  async getTopCustomers(limit: number = 10) {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: '$customerId',
          totalSpent: { $sum: '$valorTotalBRL' },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $unwind: '$customer',
      },
      {
        $project: {
          customer: 1,
          totalSpent: 1,
        },
      },
    ]).exec();
  }

  async uploadComprovante(id: string, file: Express.Multer.File): Promise<Order> {
    const key = `comprovante-${id}-${Date.now()}-${file.originalname}`;
    const url = await this.s3Service.uploadFile(file, key);
    return this.orderModel.findByIdAndUpdate(id, { comprovanteURL: url }, { new: true }).exec();
  }
}
