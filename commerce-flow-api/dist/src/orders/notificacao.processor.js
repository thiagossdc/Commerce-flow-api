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
var NotificacaoProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacaoProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
let NotificacaoProcessor = NotificacaoProcessor_1 = class NotificacaoProcessor {
    constructor() {
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new common_1.Logger(NotificacaoProcessor_1.name)
        });
    }
    async handleNotificacao(job) {
        console.log(`Enviando email de confirmação para pedido ${job.data.orderId}`);
        console.log(`Email enviado para ${job.data.customerEmail}: Pedido ${job.data.orderId} confirmado.`);
        return { success: true };
    }
    onCompleted(job) {
        console.log(`Job ${job.id} completed`);
    }
    onFailed(job, err) {
        console.log(`Job ${job.id} failed: ${err.message}`);
    }
};
exports.NotificacaoProcessor = NotificacaoProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacaoProcessor.prototype, "handleNotificacao", null);
__decorate([
    (0, bull_1.OnQueueEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacaoProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotificacaoProcessor.prototype, "onFailed", null);
exports.NotificacaoProcessor = NotificacaoProcessor = NotificacaoProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('notificacao')
], NotificacaoProcessor);
//# sourceMappingURL=notificacao.processor.js.map