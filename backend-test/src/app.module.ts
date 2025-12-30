import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { S3Module } from './s3/s3.module';
import { TestRunnerModule } from './test-runner/test-runner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI || 'mongodb://localhost:27017/backend-test'),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    CustomersModule,
    OrdersModule,
    S3Module,
    TestRunnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
