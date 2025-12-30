"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reports_controller_1 = require("../reports.controller");
const orders_service_1 = require("../../orders/orders.service");
describe('ReportsController', () => {
    let controller;
    let ordersService;
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
        const module = await testing_1.Test.createTestingModule({
            controllers: [reports_controller_1.ReportsController],
            providers: [
                {
                    provide: orders_service_1.OrdersService,
                    useValue: mockOrdersService,
                },
            ],
        }).compile();
        controller = module.get(reports_controller_1.ReportsController);
        ordersService = module.get(orders_service_1.OrdersService);
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
//# sourceMappingURL=reports.controller.spec.js.map