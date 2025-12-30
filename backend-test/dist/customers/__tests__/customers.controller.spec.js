"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customers_controller_1 = require("../customers.controller");
const customers_service_1 = require("../customers.service");
describe('CustomersController', () => {
    let controller;
    let service;
    const mockCustomer = {
        _id: '507f1f77bcf86cd799439011',
        name: 'João Silva',
        email: 'joao@email.com',
        country: 'Brasil',
        createdAt: new Date(),
    };
    const mockCustomersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [customers_controller_1.CustomersController],
            providers: [
                {
                    provide: customers_service_1.CustomersService,
                    useValue: mockCustomersService,
                },
            ],
        }).compile();
        controller = module.get(customers_controller_1.CustomersController);
        service = module.get(customers_service_1.CustomersService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a customer', async () => {
            const createCustomerDto = {
                name: 'João Silva',
                email: 'joao@email.com',
                country: 'Brasil',
            };
            mockCustomersService.create.mockResolvedValue(mockCustomer);
            const result = await controller.create(createCustomerDto);
            expect(service.create).toHaveBeenCalledWith(createCustomerDto);
            expect(result).toEqual(mockCustomer);
        });
    });
    describe('findAll', () => {
        it('should return an array of customers', async () => {
            const customers = [mockCustomer];
            mockCustomersService.findAll.mockResolvedValue(customers);
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(customers);
        });
    });
    describe('findOne', () => {
        it('should return a customer by id', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockCustomersService.findOne.mockResolvedValue(mockCustomer);
            const result = await controller.findOne(id);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockCustomer);
        });
    });
    describe('update', () => {
        it('should update a customer', async () => {
            const id = '507f1f77bcf86cd799439011';
            const updateCustomerDto = {
                name: 'João Silva Atualizado',
            };
            const updatedCustomer = Object.assign(Object.assign({}, mockCustomer), { name: 'João Silva Atualizado' });
            mockCustomersService.update.mockResolvedValue(updatedCustomer);
            const result = await controller.update(id, updateCustomerDto);
            expect(service.update).toHaveBeenCalledWith(id, updateCustomerDto);
            expect(result).toEqual(updatedCustomer);
        });
    });
    describe('remove', () => {
        it('should remove a customer', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockCustomersService.remove.mockResolvedValue(mockCustomer);
            const result = await controller.remove(id);
            expect(service.remove).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockCustomer);
        });
    });
});
//# sourceMappingURL=customers.controller.spec.js.map