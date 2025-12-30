"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const order_schema_1 = require("./schemas/order.schema");
const s3_service_1 = require("../s3/s3.service");
const customer_schema_1 = require("../customers/schemas/customer.schema");
let OrdersService = class OrdersService {
    constructor(orderModel, customerModel, httpService, notificacaoQueue, s3Service) {
        Object.defineProperty(this, "orderModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: orderModel
        });
        Object.defineProperty(this, "customerModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: customerModel
        });
        Object.defineProperty(this, "httpService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: httpService
        });
        Object.defineProperty(this, "notificacaoQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: notificacaoQueue
        });
        Object.defineProperty(this, "s3Service", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: s3Service
        });
    }
    async getExchangeRate() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://economia.awesomeapi.com.br/json/last/USD-BRL', {
                timeout: 5000,
            }));
            if (!response.data || !response.data.USDBRL) {
                throw new Error('Invalid API response format');
            }
            const rate = parseFloat(response.data.USDBRL.bid);
            if (isNaN(rate) || rate <= 0) {
                throw new Error('Invalid exchange rate value');
            }
            console.log(`💱 Taxa de câmbio obtida: USD 1.00 = BRL ${rate.toFixed(4)}`);
            return rate;
        }
        catch (error) {
            console.error('❌ Erro ao buscar taxa de câmbio:', error.message);
            const fallbackRate = 5.50;
            console.warn(`⚠️  Usando taxa de fallback: USD 1.00 = BRL ${fallbackRate.toFixed(4)}`);
            return fallbackRate;
        }
    }
    async create(createOrderDto) {
        const customer = await this.customerModel.findById(createOrderDto.customerId).exec();
        if (!customer) {
            throw new Error('Customer not found');
        }
        const rate = await this.getExchangeRate();
        const valorTotalUSD = createOrderDto.items.reduce((total, item) => total + item.quantity * item.precoUnitarioUSD, 0);
        const valorTotalBRL = valorTotalUSD * rate;
        const orderData = Object.assign(Object.assign({}, createOrderDto), { date: new Date(createOrderDto.date), valorTotalUSD,
            valorTotalBRL });
        const savedOrder = await this.orderModel.create(orderData);
        await this.notificacaoQueue.add({
            orderId: savedOrder._id,
            customerName: customer.name,
            customerEmail: customer.email,
        });
        console.log(`✅ Pedido criado com sucesso! Valor USD: $${valorTotalUSD.toFixed(2)}, Valor BRL: R$${valorTotalBRL.toFixed(2)}`);
        return savedOrder;
    }
    async findAll(page, limit) {
        const query = this.orderModel.find();
        if (page && limit) {
            query.skip((page - 1) * limit).limit(limit);
        }
        return query.exec();
    }
    async findOne(id) {
        return this.orderModel.findById(id).exec();
    }
    async update(id, updateOrderDto) {
        return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
    }
    async remove(id) {
        return this.orderModel.findByIdAndDelete(id).exec();
    }
    async getTopCustomers(limit = 10) {
        return this.orderModel.aggregate([
            {
                $group: {
                    _id: '$customerId',
                    totalSpent: { $sum: '$valorTotalBRL' },
                },
            },
            {
                $sort: { totalSpent: -1 },
            },
            {
                $limit: limit,
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer',
                },
            },
            {
                $unwind: '$customer',
            },
            {
                $project: {
                    customer: 1,
                    totalSpent: 1,
                },
            },
        ]).exec();
    }
    async uploadComprovante(id, file) {
        const key = `comprovante-${id}-${Date.now()}-${file.originalname}`;
        const url = await this.s3Service.uploadFile(file, key);
        return this.orderModel.findByIdAndUpdate(id, { comprovanteURL: url }, { new: true }).exec();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(3, (0, bull_1.InjectQueue)('notificacao')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _c : Object, typeof (_d = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _d : Object, s3_service_1.S3Service])
], OrdersService);
//# sourceMappingURL=orders.service.js.map