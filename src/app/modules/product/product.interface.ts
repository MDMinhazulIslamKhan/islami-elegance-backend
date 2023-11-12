import { Model, Types } from 'mongoose';
import { categories } from './product.constant';
export type IProduct = {
  proId?: string;
  imgURL: string;
  name: string;
  category: categories;
  price: number;
  size?: {
    size: string;
    chest: string;
    length: string;
    sleeve: string;
  };
  description: string;
  facebookURL?: string;
  sellCount: number;
  availability: boolean;
  review: Array<{ userId: Types.ObjectId; review: string }>;
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;

export type IProductFilters = {
  searchTerm?: string;
  lowestPrice?: number;
  highestPrice?: number;
  name?: string;
  availability?: string;
  category?: string;
};
