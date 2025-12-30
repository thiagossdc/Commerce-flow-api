import { OrdersService } from '../orders/orders.service';
export declare class ReportsController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getTopCustomers(top?: string): Promise<any>;
}
