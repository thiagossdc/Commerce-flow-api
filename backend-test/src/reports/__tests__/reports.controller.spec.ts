import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { OrdersService } from '../../orders/orders.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let ordersService: OrdersService;

  const mockTopCustomers = [
    {
      _id: '507f1f77bcf86cd799439011',
      customer: {
        _id: '507f1f77bcf86cd799439011',
        name: 'João Silva',
        email: 'joao@email.com',
        country: 'Brasil',
        createdAt: new Date(),
      },
      totalSpent: 1500.00,
    },
  ];

  const mockOrdersService = {
    getTopCustomers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTopCustomers', () => {
    it('should return top customers with default limit', async () => {
      mockOrdersService.getTopCustomers.mockResolvedValue(mockTopCustomers);

      const result = await controller.getTopCustomers();

      expect(ordersService.getTopCustomers).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockTopCustomers);
    });

    it('should return top customers with custom limit', async () => {
      const customLimit = 5;
      mockOrdersService.getTopCustomers.mockResolvedValue(mockTopCustomers);

      const result = await controller.getTopCustomers(customLimit.toString());

      expect(ordersService.getTopCustomers).toHaveBeenCalledWith(customLimit);
      expect(result).toEqual(mockTopCustomers);
    });

    it('should handle invalid limit parameter', async () => {
      mockOrdersService.getTopCustomers.mockResolvedValue(mockTopCustomers);

      const result = await controller.getTopCustomers('invalid');

      expect(ordersService.getTopCustomers).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockTopCustomers);
    });

    it('should handle empty limit parameter', async () => {
      mockOrdersService.getTopCustomers.mockResolvedValue(mockTopCustomers);

      const result = await controller.getTopCustomers('');

      expect(ordersService.getTopCustomers).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockTopCustomers);
    });
  });
});
