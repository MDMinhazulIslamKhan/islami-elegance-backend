import { Model, Types } from 'mongoose';
import { status } from './order.constant';

export type IOrder = {
  userId: Types.ObjectId;
  status: status;
  details: {
    name: string;
    phoneNumber: string;
    district: string;
    address: string;
    information: string;
  };
  product: Array<{
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingCost: number;
  total: number;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;

export type IOrderFilters = {
  searchTerm?: string;
  status?: string;
};
