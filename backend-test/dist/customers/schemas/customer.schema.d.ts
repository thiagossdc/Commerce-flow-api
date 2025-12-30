import { Document } from 'mongoose';
export type CustomerDocument = Customer & Document;
export declare class Customer {
    name: string;
    email: string;
    country: string;
    createdAt: Date;
}
export declare const CustomerSchema: any;
