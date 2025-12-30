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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
let ReportsController = class ReportsController {
    constructor(ordersService) {
        Object.defineProperty(this, "ordersService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ordersService
        });
    }
    getTopCustomers(top) {
        const limit = top ? parseInt(top, 10) : 10;
        return this.ordersService.getTopCustomers(limit);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('top-clientes'),
    __param(0, (0, common_1.Query)('top')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopCustomers", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('relatorios'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map