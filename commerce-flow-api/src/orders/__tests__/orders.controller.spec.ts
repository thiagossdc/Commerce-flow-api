import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../schemas/order.schema';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrder: Order = {
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
    valorTotalBRL: 115.00,
    comprovanteURL: undefined,
    createdAt: new Date(),
  };

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getExchangeRate: jest.fn(),
    uploadComprovante: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getExchangeRate', () => {
    it('should return exchange rate on success', async () => {
      const mockRate = 5.50;
      mockOrdersService.getExchangeRate.mockResolvedValue(mockRate);

      const result = await controller.getExchangeRate();

      expect(service.getExchangeRate).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        data: {
          rate: mockRate,
          currency: 'USD/BRL',
          description: `USD 1.00 = BRL ${mockRate.toFixed(4)}`,
          lastUpdated: expect.any(String),
        },
      });
    });

    it('should return fallback data on error', async () => {
      const error = new Error('API Error');
      mockOrdersService.getExchangeRate.mockRejectedValue(error);

      const result = await controller.getExchangeRate();

      expect(service.getExchangeRate).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        error: error.message,
        fallback: true,
        data: {
          rate: 5.50,
          currency: 'USD/BRL',
          description: 'Taxa de fallback utilizada devido a falha na API externa',
          lastUpdated: expect.any(String),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of orders without pagination', async () => {
      const orders = [mockOrder];
      mockOrdersService.findAll.mockResolvedValue(orders);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(orders);
    });

    it('should return an array of orders with pagination', async () => {
      const orders = [mockOrder];
      mockOrdersService.findAll.mockResolvedValue(orders);

      const result = await controller.findAll('1', '10');

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateOrderDto: UpdateOrderDto = {
        date: '2025-12-31',
      };

      const updatedOrder = { ...mockOrder, date: new Date('2025-12-31') };
      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update(id, updateOrderDto);

      expect(service.update).toHaveBeenCalledWith(id, updateOrderDto);
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockOrdersService.remove.mockResolvedValue(mockOrder);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('uploadComprovante', () => {
    it('should upload comprovante file', async () => {
      const id = '507f1f77bcf86cd799439011';
      const mockFile = {
        fieldname: 'file',
        originalname: 'comprovante.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('mock file content'),
        size: 12345,
      } as Express.Multer.File;

      const updatedOrder = { ...mockOrder, comprovanteURL: 'https://s3.amazonaws.com/bucket/comprovante-123.pdf' };
      mockOrdersService.uploadComprovante.mockResolvedValue(updatedOrder);

      const result = await controller.uploadComprovante(id, mockFile);

      expect(service.uploadComprovante).toHaveBeenCalledWith(id, mockFile);
      expect(result).toEqual(updatedOrder);
    });
  });
});
