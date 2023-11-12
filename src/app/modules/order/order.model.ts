import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';
import { statusType } from './order.constant';

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: statusType,
      required: true,
      default: 'process',
    },
    details: {
      type: {
        name: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        district: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        information: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    product: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder, OrderModel>('Order', orderSchema);

export default Order;
