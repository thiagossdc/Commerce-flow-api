import { Process, Processor, OnQueueEvent } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor('notificacao')
export class NotificacaoProcessor {
  private readonly logger = new Logger(NotificacaoProcessor.name);

  @Process()
  async handleNotificacao(job: Job<any>) {
    console.log(`Enviando email de confirmação para pedido ${job.data.orderId}`);
    // simula envio de email
    console.log(`Email enviado para ${job.data.customerEmail}: Pedido ${job.data.orderId} confirmado.`);
    return { success: true };
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed`);
  }

  @OnQueueEvent('failed')
  onFailed(job: Job, err: any) {
    console.log(`Job ${job.id} failed: ${err.message}`);
  }
}
