import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';

describe('CreateOrderDto', () => {
  it('should pass validation with valid data', async () => {
    const dtoData = {
      customerId: '507f1f77bcf86cd799439011',
      date: '2023-12-30',
      items: [
        {
          product: 'Product A',
          quantity: 2,
          precoUnitarioUSD: 50.00,
        },
      ],
    };

    const dto = plainToInstance(CreateOrderDto, dtoData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with missing customerId', async () => {
    const dtoData = {
      date: '2023-12-30',
      items: [
        {
          product: 'Product A',
          quantity: 2,
          precoUnitarioUSD: 50.00,
        },
      ],
    };

    const dto = plainToInstance(CreateOrderDto, dtoData);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with invalid date', async () => {
    const dtoData = {
      customerId: '507f1f77bcf86cd799439011',
      date: 'invalid-date',
      items: [
        {
          product: 'Product A',
          quantity: 2,
          precoUnitarioUSD: 50.00,
        },
      ],
    };

    const dto = plainToInstance(CreateOrderDto, dtoData);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with empty items', async () => {
    const dtoData = {
      customerId: '507f1f77bcf86cd799439011',
      date: '2023-12-30',
      items: [],
    };

    const dto = plainToInstance(CreateOrderDto, dtoData);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with invalid item', async () => {
    const dtoData = {
      customerId: '507f1f77bcf86cd799439011',
      date: '2023-12-30',
      items: [
        {
          product: '',
          quantity: 2,
          precoUnitarioUSD: 50.00,
        },
      ],
    };

    const dto = plainToInstance(CreateOrderDto, dtoData);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
