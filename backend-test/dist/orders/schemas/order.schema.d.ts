import { Document, Types } from 'mongoose';
export type OrderDocument = Order & Document;
export declare class OrderItem {
    product: string;
    quantity: number;
    precoUnitarioUSD: number;
}
export declare class Order {
    customerId: Types.ObjectId;
    date: Date;
    items: OrderItem[];
    valorTotalUSD: number;
    valorTotalBRL: number;
    comprovanteURL?: string;
    createdAt: Date;
}
export declare const OrderSchema: any;
export declare const OrderItemSchema: any;
