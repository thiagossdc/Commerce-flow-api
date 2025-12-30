import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from '../customers.controller';
import { CustomersService } from '../customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer, CustomerDocument } from '../schemas/customer.schema';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomer: CustomerDocument = {
    _id: '507f1f77bcf86cd799439011' as any,
    name: 'João Silva',
    email: 'joao@email.com',
    country: 'Brasil',
    createdAt: new Date(),
  } as CustomerDocument;

  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
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
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'João Silva Atualizado',
      };

      const updatedCustomer = { ...mockCustomer, name: 'João Silva Atualizado' };
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
