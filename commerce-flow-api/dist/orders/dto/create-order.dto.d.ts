declare class CreateOrderItemDto {
    product: string;
    quantity: number;
    precoUnitarioUSD: number;
}
export declare class CreateOrderDto {
    customerId: string;
    date: string;
    items: CreateOrderItemDto[];
}
export {};
