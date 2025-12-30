import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").Order>;
    getExchangeRate(): Promise<{
        success: boolean;
        data: {
            rate: number;
            currency: string;
            description: string;
            lastUpdated: string;
        };
        error?: undefined;
        fallback?: undefined;
    } | {
        success: boolean;
        error: any;
        fallback: boolean;
        data: {
            rate: number;
            currency: string;
            description: string;
            lastUpdated: string;
        };
    }>;
    findAll(page?: string, limit?: string): Promise<import("./schemas/order.schema").Order[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./schemas/order.schema").Order>;
    remove(id: string): Promise<import("./schemas/order.schema").Order>;
    uploadComprovante(id: string, file: Express.Multer.File): Promise<import("./schemas/order.schema").Order>;
}
