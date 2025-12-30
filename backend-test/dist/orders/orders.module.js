"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const bull_1 = require("@nestjs/bull");
const order_schema_1 = require("./schemas/order.schema");
const customer_schema_1 = require("../customers/schemas/customer.schema");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const reports_controller_1 = require("../reports/reports.controller");
const s3_module_1 = require("../s3/s3.module");
const notificacao_processor_1 = require("./notificacao.processor");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: customer_schema_1.Customer.name, schema: customer_schema_1.CustomerSchema }
            ]),
            axios_1.HttpModule,
            bull_1.BullModule.registerQueue({
                name: 'notificacao',
            }),
            s3_module_1.S3Module,
        ],
        providers: [orders_service_1.OrdersService, notificacao_processor_1.NotificacaoProcessor],
        controllers: [orders_controller_1.OrdersController, reports_controller_1.ReportsController],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map