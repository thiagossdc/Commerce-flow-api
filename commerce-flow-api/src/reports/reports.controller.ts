import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Controller('relatorios')
export class ReportsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('top-clientes')
  getTopCustomers(@Query('top') top?: string) {
    const limit = top ? parseInt(top, 10) : 10;
    return this.ordersService.getTopCustomers(limit);
  }
}
