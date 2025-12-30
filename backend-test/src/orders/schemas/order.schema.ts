import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  precoUnitarioUSD: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  valorTotalUSD: number;

  @Prop({ required: true })
  valorTotalBRL: number;

  @Prop()
  comprovanteURL?: string;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
