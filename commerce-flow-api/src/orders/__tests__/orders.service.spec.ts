// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { of, throwError } from 'rxjs';
import { OrdersService } from '../orders.service';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Customer, CustomerDocument } from '../../customers/schemas/customer.schema';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { S3Service } from '../../s3/s3.service';
import { jest } from '@jest/globals';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: jest.Mocked<Model<OrderDocument>>;
  let customerModel: jest.Mocked<Model<CustomerDocument>>;
  let httpService: jest.Mocked<HttpService>;
  let s3Service: jest.Mocked<S3Service>;

  const mockCustomer: CustomerDocument = {
    _id: '507f1f77bcf86cd799439011' as any,
    name: 'João Silva',
    email: 'joao@email.com',
    country: 'Brasil',
    createdAt: new Date(),
  } as CustomerDocument;

  const mockOrder: OrderDocument = {
    _id: '507f1f77bcf86cd799439012' as any,
    customerId: '507f1f77bcf86cd799439011' as any,
    date: new Date(),
    items: [
      {
        product: 'Produto Teste',
        quantity: 2,
        precoUnitarioUSD: 10.50,
      },
    ],
    valorTotalUSD: 21.00,
    valorTotalBRL: 115.50,
    comprovanteURL: undefined,
    createdAt: new Date(),
  } as OrderDocument;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockOrder),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            aggregate: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(Customer.name),
          useValue: {
            findById: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: getQueueToken('notificacao'),
          useValue: mockQueue,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get(getModelToken(Order.name)) as jest.Mocked<Model<OrderDocument>>;
    customerModel = module.get(getModelToken(Customer.name)) as jest.Mocked<Model<CustomerDocument>>;
    httpService = module.get(HttpService) as jest.Mocked<HttpService>;
    s3Service = module.get(S3Service) as jest.Mocked<S3Service>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('should return exchange rate from API', async () => {
      const mockApiResponse = {
        data: {
          USDBRL: {
            bid: '5.4921',
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      const result = await service.getExchangeRate();

      expect(result).toBe(5.4921);
      expect(httpService.get).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/last/USD-BRL', {
        timeout: 5000,
      });
    });

    it('should return fallback rate on API error', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('API Error')));

      const result = await service.getExchangeRate();

      expect(result).toBe(5.50);
    });

    it('should return fallback rate on invalid response', async () => {
      const mockApiResponse = {
        data: {},
      };

      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      const result = await service.getExchangeRate();

      expect(result).toBe(5.50);
    });

    it('should return fallback rate on invalid rate value', async () => {
      const mockApiResponse = {
        data: {
          USDBRL: {
            bid: 'invalid',
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      const result = await service.getExchangeRate();

      expect(result).toBe(5.50);
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: '507f1f77bcf86cd799439011',
        date: '2025-12-30',
        items: [
          {
            product: 'Produto Teste',
            quantity: 2,
            precoUnitarioUSD: 10.50,
          },
        ],
      };

      customerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCustomer),
      });

      mockHttpService.get.mockReturnValue(of({
        data: {
          USDBRL: {
            bid: '5.50',
          },
        },
      }));

      const result = await service.create(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(customerModel.findById).toHaveBeenCalledWith(createOrderDto.customerId);
    });

    it('should throw error if customer not found', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: '507f1f77bcf86cd799439011',
        date: '2025-12-30',
        items: [],
      };

      customerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.create(createOrderDto)).rejects.toThrow('Customer not found');
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      orderModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(orders),
      });

      const result = await service.findAll();

      expect(result).toEqual(orders);
      expect(orderModel.find).toHaveBeenCalled();
    });

    it('should return orders with pagination', async () => {
      const orders = [mockOrder];
      const mockQuery = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(orders),
      };

      orderModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll(1, 10);

      expect(result).toEqual(orders);
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const id = '507f1f77bcf86cd799439012';
      orderModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrder),
      });

      const result = await service.findOne(id);

      expect(result).toEqual(mockOrder);
      expect(orderModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const id = '507f1f77bcf86cd799439012';
      const updateOrderDto: UpdateOrderDto = {
        date: '2025-12-31',
      };

      const updatedOrder = { ...mockOrder, date: new Date('2025-12-31') };
      orderModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedOrder),
      });

      const result = await service.update(id, updateOrderDto);

      expect(result).toEqual(updatedOrder);
      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateOrderDto, { new: true });
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const id = '507f1f77bcf86cd799439012';
      orderModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrder),
      });

      const result = await service.remove(id);

      expect(result).toEqual(mockOrder);
      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('getTopCustomers', () => {
    it('should return top customers', async () => {
      const topCustomers = [
        {
          customer: mockCustomer,
          totalSpent: 1000,
        },
      ];

      orderModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(topCustomers),
      });

      const result = await service.getTopCustomers(5);

      expect(result).toEqual(topCustomers);
      expect(orderModel.aggregate).toHaveBeenCalled();
    });
  });

  describe('uploadComprovante', () => {
    it('should upload comprovante and update order', async () => {
      const id = '507f1f77bcf86cd799439012';
      const mockFile = {
        originalname: 'comprovante.pdf',
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const url = 'https://s3.amazonaws.com/bucket/comprovante.pdf';
      const updatedOrder = { ...mockOrder, comprovanteURL: url };

      mockS3Service.uploadFile.mockResolvedValue(url);
      orderModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedOrder),
      });

      const result = await service.uploadComprovante(id, mockFile);

      expect(result).toEqual(updatedOrder);
      expect(s3Service.uploadFile).toHaveBeenCalled();
      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { comprovanteURL: url }, { new: true });
    });
  });
});
