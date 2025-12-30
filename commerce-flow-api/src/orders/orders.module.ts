import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Order, OrderSchema } from './schemas/order.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ReportsController } from '../reports/reports.controller';
import { S3Module } from '../s3/s3.module';
import { NotificacaoProcessor } from './notificacao.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Customer.name, schema: CustomerSchema }
    ]),
    HttpModule,
    BullModule.registerQueue({
      name: 'notificacao',
    }),
    S3Module,
  ],
  providers: [OrdersService, NotificacaoProcessor],
  controllers: [OrdersController, ReportsController],
})
export class OrdersModule {}
