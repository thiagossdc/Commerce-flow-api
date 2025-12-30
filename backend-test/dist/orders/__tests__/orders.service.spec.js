"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bull_1 = require("@nestjs/bull");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const orders_service_1 = require("../orders.service");
const order_schema_1 = require("../schemas/order.schema");
const customer_schema_1 = require("../../customers/schemas/customer.schema");
const s3_service_1 = require("../../s3/s3.service");
const globals_1 = require("@jest/globals");
describe('OrdersService', () => {
    let service;
    let orderModel;
    let customerModel;
    let httpService;
    let s3Service;
    const mockCustomer = {
        _id: '507f1f77bcf86cd799439011',
        name: 'João Silva',
        email: 'joao@email.com',
        country: 'Brasil',
        createdAt: new Date(),
    };
    const mockOrder = {
        _id: '507f1f77bcf86cd799439012',
        customerId: '507f1f77bcf86cd799439011',
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
    };
    const mockHttpService = {
        get: globals_1.jest.fn(),
    };
    const mockS3Service = {
        uploadFile: globals_1.jest.fn(),
    };
    const mockQueue = {
        add: globals_1.jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                orders_service_1.OrdersService,
                {
                    provide: (0, mongoose_1.getModelToken)(order_schema_1.Order.name),
                    useValue: {
                        create: globals_1.jest.fn().mockResolvedValue(mockOrder),
                        find: globals_1.jest.fn(),
                        findById: globals_1.jest.fn(),
                        findByIdAndUpdate: globals_1.jest.fn(),
                        findByIdAndDelete: globals_1.jest.fn(),
                        aggregate: globals_1.jest.fn(),
                        exec: globals_1.jest.fn(),
                    },
                },
                {
                    provide: (0, mongoose_1.getModelToken)(customer_schema_1.Customer.name),
                    useValue: {
                        findById: globals_1.jest.fn(),
                        exec: globals_1.jest.fn(),
                    },
                },
                {
                    provide: axios_1.HttpService,
                    useValue: mockHttpService,
                },
                {
                    provide: (0, bull_1.getQueueToken)('notificacao'),
                    useValue: mockQueue,
                },
                {
                    provide: s3_service_1.S3Service,
                    useValue: mockS3Service,
                },
            ],
        }).compile();
        service = module.get(orders_service_1.OrdersService);
        orderModel = module.get((0, mongoose_1.getModelToken)(order_schema_1.Order.name));
        customerModel = module.get((0, mongoose_1.getModelToken)(customer_schema_1.Customer.name));
        httpService = module.get(axios_1.HttpService);
        s3Service = module.get(s3_service_1.S3Service);
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
            mockHttpService.get.mockReturnValue((0, rxjs_1.of)(mockApiResponse));
            const result = await service.getExchangeRate();
            expect(result).toBe(5.4921);
            expect(httpService.get).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/last/USD-BRL', {
                timeout: 5000,
            });
        });
        it('should return fallback rate on API error', async () => {
            mockHttpService.get.mockReturnValue((0, rxjs_1.throwError)(() => new Error('API Error')));
            const result = await service.getExchangeRate();
            expect(result).toBe(5.50);
        });
        it('should return fallback rate on invalid response', async () => {
            const mockApiResponse = {
                data: {},
            };
            mockHttpService.get.mockReturnValue((0, rxjs_1.of)(mockApiResponse));
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
            mockHttpService.get.mockReturnValue((0, rxjs_1.of)(mockApiResponse));
            const result = await service.getExchangeRate();
            expect(result).toBe(5.50);
        });
    });
    describe('create', () => {
        it('should create an order', async () => {
            const createOrderDto = {
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
                exec: globals_1.jest.fn().mockResolvedValue(mockCustomer),
            });
            mockHttpService.get.mockReturnValue((0, rxjs_1.of)({
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
            const createOrderDto = {
                customerId: '507f1f77bcf86cd799439011',
                date: '2025-12-30',
                items: [],
            };
            customerModel.findById.mockReturnValue({
                exec: globals_1.jest.fn().mockResolvedValue(null),
            });
            await expect(service.create(createOrderDto)).rejects.toThrow('Customer not found');
        });
    });
    describe('findAll', () => {
        it('should return all orders', async () => {
            const orders = [mockOrder];
            orderModel.find.mockReturnValue({
                skip: globals_1.jest.fn().mockReturnThis(),
                limit: globals_1.jest.fn().mockReturnThis(),
                exec: globals_1.jest.fn().mockResolvedValue(orders),
            });
            const result = await service.findAll();
            expect(result).toEqual(orders);
            expect(orderModel.find).toHaveBeenCalled();
        });
        it('should return orders with pagination', async () => {
            const orders = [mockOrder];
            const mockQuery = {
                skip: globals_1.jest.fn().mockReturnThis(),
                limit: globals_1.jest.fn().mockReturnThis(),
                exec: globals_1.jest.fn().mockResolvedValue(orders),
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
                exec: globals_1.jest.fn().mockResolvedValue(mockOrder),
            });
            const result = await service.findOne(id);
            expect(result).toEqual(mockOrder);
            expect(orderModel.findById).toHaveBeenCalledWith(id);
        });
    });
    describe('update', () => {
        it('should update an order', async () => {
            const id = '507f1f77bcf86cd799439012';
            const updateOrderDto = {
                date: '2025-12-31',
            };
            const updatedOrder = Object.assign(Object.assign({}, mockOrder), { date: new Date('2025-12-31') });
            orderModel.findByIdAndUpdate.mockReturnValue({
                exec: globals_1.jest.fn().mockResolvedValue(updatedOrder),
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
                exec: globals_1.jest.fn().mockResolvedValue(mockOrder),
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
                exec: globals_1.jest.fn().mockResolvedValue(topCustomers),
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
            };
            const url = 'https://s3.amazonaws.com/bucket/comprovante.pdf';
            const updatedOrder = Object.assign(Object.assign({}, mockOrder), { comprovanteURL: url });
            mockS3Service.uploadFile.mockResolvedValue(url);
            orderModel.findByIdAndUpdate.mockReturnValue({
                exec: globals_1.jest.fn().mockResolvedValue(updatedOrder),
            });
            const result = await service.uploadComprovante(id, mockFile);
            expect(result).toEqual(updatedOrder);
            expect(s3Service.uploadFile).toHaveBeenCalled();
            expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { comprovanteURL: url }, { new: true });
        });
    });
});
//# sourceMappingURL=orders.service.spec.js.map