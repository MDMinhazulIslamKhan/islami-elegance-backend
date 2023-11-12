import { IOrder, IOrderFilters } from './order.interface';
import Order from './order.model';
import {
  IGenericResponse,
  IPaginationOptions,
  UserInfoFromToken,
} from '../../../interfaces/common';
import { SortOrder } from 'mongoose';
import User from '../auth/auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { orderSearchableField } from './order.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';
import Product from '../product/product.model';

const createOrder = async (
  order: Partial<IOrder>,
  userInfo: UserInfoFromToken,
): Promise<IOrder | null> => {
  const user = await User.findById(userInfo.id);
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const count = order.product?.length;
  let total = order.shippingCost!;
  for (let i = 0; i < count!; i++) {
    const product = await Product.findById(order.product![i].productId);
    if (!product) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `${order.product![i].productName} is not available.`,
      );
    }
    total += order.product![i].price;
  }
  order.userId = userInfo.id;
  order.total = total;

  const result = await Order.create(order);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create product!');
  }
  return result;
};

const allPendingOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  userInfo: UserInfoFromToken,
): Promise<IGenericResponse<IOrder[]>> => {
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // for filter pending orders
  andConditions.push({
    $and: [{ status: 'process' }],
  });

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableField.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  // for exact match user and condition
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // if no condition is given
  const query =
    andConditions.length > 0 ? { $and: andConditions } : { status: 'process' };

  const result = await Order.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'userId',
    })
    .populate({
      path: 'product.productId',
    });

  const count = await Order.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const allDeliveredOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  userInfo: UserInfoFromToken,
): Promise<IGenericResponse<IOrder[]>> => {
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // for filter creator of task
  andConditions.push({
    $and: [{ status: 'delivered' }],
  });

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableField.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  // for exact match user and condition
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // if no condition is given
  const query =
    andConditions.length > 0
      ? { $and: andConditions }
      : { status: 'delivered' };

  const result = await Order.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'userId',
    })
    .populate({
      path: 'product.productId',
    });

  const count = await Order.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const allAcceptedOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  userInfo: UserInfoFromToken,
): Promise<IGenericResponse<IOrder[]>> => {
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // for filter creator of task
  andConditions.push({
    $and: [{ status: 'accept' }],
  });

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableField.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  // for exact match user and condition
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // if no condition is given
  const query =
    andConditions.length > 0 ? { $and: andConditions } : { status: 'accept' };

  const result = await Order.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'userId',
    })
    .populate({
      path: 'product.productId',
    });

  const count = await Order.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  allPendingOrders,
  allDeliveredOrders,
  allAcceptedOrders,
};
