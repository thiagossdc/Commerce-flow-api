"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bull_1 = require("@nestjs/bull");
const notificacao_processor_1 = require("../notificacao.processor");
describe('NotificacaoProcessor', () => {
    let processor;
    let queue;
    const mockQueue = {
        add: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                notificacao_processor_1.NotificacaoProcessor,
                {
                    provide: (0, bull_1.getQueueToken)('notificacao'),
                    useValue: mockQueue,
                },
            ],
        }).compile();
        processor = module.get(notificacao_processor_1.NotificacaoProcessor);
        queue = module.get((0, bull_1.getQueueToken)('notificacao'));
    });
    it('should be defined', () => {
        expect(processor).toBeDefined();
    });
    describe('handleNotificacao', () => {
        it('should handle notificacao job', async () => {
            const mockJob = {
                data: {
                    orderId: '507f1f77bcf86cd799439011',
                    customerName: 'João Silva',
                    customerEmail: 'joao@email.com',
                },
            };
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const result = await processor.handleNotificacao(mockJob);
            expect(result).toEqual({ success: true });
            expect(consoleSpy).toHaveBeenCalledWith(`Enviando email de confirmação para pedido ${mockJob.data.orderId}`);
            expect(consoleSpy).toHaveBeenCalledWith(`Email enviado para ${mockJob.data.customerEmail}: Pedido ${mockJob.data.orderId} confirmado.`);
            consoleSpy.mockRestore();
        });
    });
    describe('event handlers', () => {
        it('should log on job completed', () => {
            const mockJob = { id: '123' };
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            processor.onCompleted(mockJob);
            expect(consoleSpy).toHaveBeenCalledWith(`Job ${mockJob.id} completed`);
            consoleSpy.mockRestore();
        });
        it('should log on job failed', () => {
            const mockJob = { id: '123' };
            const mockErr = new Error('Job failed');
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            processor.onFailed(mockJob, mockErr);
            expect(consoleSpy).toHaveBeenCalledWith(`Job ${mockJob.id} failed: ${mockErr.message}`);
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=notificacao.processor.spec.js.map