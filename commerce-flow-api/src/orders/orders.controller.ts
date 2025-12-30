import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UsePipes(new ValidationPipe())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('exchange-rate')
  async getExchangeRate() {
    try {
      const rate = await this.ordersService.getExchangeRate();
      return {
        success: true,
        data: {
          rate,
          currency: 'USD/BRL',
          description: `USD 1.00 = BRL ${rate.toFixed(4)}`,
          lastUpdated: new Date().toISOString(),
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: true,
        data: {
          rate: 5.50,
          currency: 'USD/BRL',
          description: 'Taxa de fallback utilizada devido a falha na API externa',
          lastUpdated: new Date().toISOString(),
        }
      };
    }
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.ordersService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post(':id/comprovante')
  @UseInterceptors(FileInterceptor('file'))
  uploadComprovante(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.ordersService.uploadComprovante(id, file);
  }
}
