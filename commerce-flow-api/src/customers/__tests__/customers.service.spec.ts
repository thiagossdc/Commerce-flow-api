import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomersService } from '../customers.service';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let model: Model<CustomerDocument>;

  const mockCustomer: CustomerDocument = {
    _id: '507f1f77bcf86cd799439011' as any,
    name: 'João Silva',
    email: 'joao@email.com',
    country: 'Brasil',
    createdAt: new Date(),
  } as CustomerDocument;

  const mockCustomerModel = {
    create: jest.fn().mockResolvedValue(mockCustomer),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken(Customer.name),
          useValue: mockCustomerModel,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    model = module.get<Model<CustomerDocument>>(getModelToken(Customer.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
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
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'João Silva Atualizado',
      };

      const updatedCustomer = { ...mockCustomer, name: 'João Silva Atualizado' };
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
