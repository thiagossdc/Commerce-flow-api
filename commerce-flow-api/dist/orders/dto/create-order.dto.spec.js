"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_order_dto_1 = require("./create-order.dto");
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
        const dto = (0, class_transformer_1.plainToInstance)(create_order_dto_1.CreateOrderDto, dtoData);
        const errors = await (0, class_validator_1.validate)(dto);
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
        const dto = (0, class_transformer_1.plainToInstance)(create_order_dto_1.CreateOrderDto, dtoData);
        const errors = await (0, class_validator_1.validate)(dto);
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
        const dto = (0, class_transformer_1.plainToInstance)(create_order_dto_1.CreateOrderDto, dtoData);
        const errors = await (0, class_validator_1.validate)(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
    it('should fail validation with empty items', async () => {
        const dtoData = {
            customerId: '507f1f77bcf86cd799439011',
            date: '2023-12-30',
            items: [],
        };
        const dto = (0, class_transformer_1.plainToInstance)(create_order_dto_1.CreateOrderDto, dtoData);
        const errors = await (0, class_validator_1.validate)(dto);
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
        const dto = (0, class_transformer_1.plainToInstance)(create_order_dto_1.CreateOrderDto, dtoData);
        const errors = await (0, class_validator_1.validate)(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=create-order.dto.spec.js.map