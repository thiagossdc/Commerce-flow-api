import { Queue } from 'bull';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { S3Service } from '../s3/s3.service';
import { CustomerDocument } from '../customers/schemas/customer.schema';
export declare class OrdersService {
    private orderModel;
    private customerModel;
    private readonly httpService;
    private notificacaoQueue;
    private readonly s3Service;
    constructor(orderModel: Model<OrderDocument>, customerModel: Model<CustomerDocument>, httpService: HttpService, notificacaoQueue: Queue, s3Service: S3Service);
    getExchangeRate(): Promise<number>;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(page?: number, limit?: number): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: string): Promise<Order>;
    getTopCustomers(limit?: number): Promise<any[]>;
    uploadComprovante(id: string, file: Express.Multer.File): Promise<Order>;
}
