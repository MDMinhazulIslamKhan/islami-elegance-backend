import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';
import { categoriesList, sizesList } from './product.constant';

const productSchema = new Schema<IProduct>(
  {
    proId: {
      type: String,
    },
    imgURL: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: categoriesList,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: [{ type: String, enum: sizesList }],
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    facebookURL: {
      type: String,
    },
    sellCount: {
      type: Number,
      default: 0,
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    review: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        review: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Product = model<IProduct, ProductModel>('Product', productSchema);

export default Product;
