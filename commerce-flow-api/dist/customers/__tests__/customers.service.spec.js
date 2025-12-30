"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const customers_service_1 = require("../customers.service");
const customer_schema_1 = require("../schemas/customer.schema");
describe('CustomersService', () => {
    let service;
    let model;
    const mockCustomer = {
        _id: '507f1f77bcf86cd799439011',
        name: 'João Silva',
        email: 'joao@email.com',
        country: 'Brasil',
        createdAt: new Date(),
    };
    const mockCustomerModel = {
        create: jest.fn().mockResolvedValue(mockCustomer),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                customers_service_1.CustomersService,
                {
                    provide: (0, mongoose_1.getModelToken)(customer_schema_1.Customer.name),
                    useValue: mockCustomerModel,
                },
            ],
        }).compile();
        service = module.get(customers_service_1.CustomersService);
        model = module.get((0, mongoose_1.getModelToken)(customer_schema_1.Customer.name));
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('should create a customer', async () => {
            const createCustomerDto = {
                name: 'João Silva',
                email: 'joao@email.com',
                country: 'Brasil',
            };
            const result = await service.create(createCustomerDto);
            expect(mockCustomerModel.create).toHaveBeenCalledWith(createCustomerDto);
            expect(result).toEqual(mockCustomer);
        });
    });
    describe('findAll', () => {
        it('should return an array of customers', async () => {
            const customers = [mockCustomer];
            mockCustomerModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(customers),
            });
            const result = await service.findAll();
            expect(model.find).toHaveBeenCalled();
            expect(result).toEqual(customers);
        });
    });
    describe('findOne', () => {
        it('should return a customer by id', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockCustomerModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCustomer),
            });
            const result = await service.findOne(id);
            expect(model.findById).toHaveBeenCalledWith(id);
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
            mockCustomerModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedCustomer),
            });
            const result = await service.update(id, updateCustomerDto);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, updateCustomerDto, { new: true });
            expect(result).toEqual(updatedCustomer);
        });
    });
    describe('remove', () => {
        it('should remove a customer', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockCustomerModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCustomer),
            });
            const result = await service.remove(id);
            expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockCustomer);
        });
    });
});
//# sourceMappingURL=customers.service.spec.js.map