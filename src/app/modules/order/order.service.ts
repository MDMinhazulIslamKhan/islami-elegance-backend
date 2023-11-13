import { IOrder, IOrderFilters } from './order.interface';
import Order from './order.model';
import {
  IGenericResponse,
  IPaginationOptions,
  UserInfoFromToken,
} from '../../../interfaces/common';
import mongoose, { SortOrder } from 'mongoose';
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

const deleteOrder = async (id: string, userInfo: UserInfoFromToken) => {
  const isOrder = await Order.findOne({
    $and: [{ _id: id }, { userId: userInfo.id }],
  });

  if (!isOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Order doesn't exist or this is not your order.",
    );
  }

  if (isOrder.status == 'accept') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Your order is on the way, can't delete order.",
    );
  }

  const result = await Order.findOneAndDelete({
    $and: [{ _id: id }, { userId: userInfo.id }],
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete order!');
  }

  return result;
};

const myPendingOrders = async (
  userInfo: UserInfoFromToken,
): Promise<IOrder[]> => {
  const user = await User.findById(userInfo.id);
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const result = await Order.find({
    $and: [{ status: { $nin: 'delivered' } }, { userId: userInfo.id }],
  });

  return result;
};

const myCompletedOrder = async (
  userInfo: UserInfoFromToken,
): Promise<IOrder[]> => {
  const user = await User.findById(userInfo.id);
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const result = await Order.find({
    $and: [{ status: 'delivered' }, { userId: userInfo.id }],
  });

  return result;
};

const acceptOrder = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IOrder | null> => {
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const isOrder = await Order.findOne({
    _id: id,
  });

  if (!isOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order doesn't exist.");
  }

  if (isOrder.status !== 'process') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Order is in '${isOrder.status}' stage.`,
    );
  }

  const result = await Order.findOneAndUpdate(
    { _id: id },
    { status: 'accept' },
    { new: true },
  );

  return result;
};

const cancelOrder = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IOrder | null> => {
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const isOrder = await Order.findOne({
    _id: id,
  });

  if (!isOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order doesn't exist.");
  }

  if (isOrder.status == 'delivered' || isOrder.status == 'cancel') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Order is already ${isOrder.status}.`,
    );
  }

  const result = await Order.findOneAndUpdate(
    { _id: id },
    { status: 'cancel' },
    { new: true },
  );

  return result;
};

const deliveredOrder = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IOrder | null> => {
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }
  const isOrder = await Order.findOne({
    _id: id,
  });

  if (!isOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order doesn't exist.");
  }
  // return isOrder;
  if (isOrder.status == 'delivered' || isOrder.status == 'cancel') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Order is already ${isOrder.status}.`,
    );
  } else if (isOrder.status == 'process') {
    throw new ApiError(httpStatus.BAD_REQUEST, `Order is not accept yet.`);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Order.findOneAndUpdate(
      { _id: id },
      { status: 'delivered' },
      {
        session,
      },
    );

    await User.findOneAndUpdate(
      { _id: isOrder.userId },
      { $inc: { complectedOrder: 1 } },
      {
        session,
      },
    );

    await User.findOneAndUpdate(
      { _id: isOrder.userId },
      { $inc: { totalCost: isOrder.total } },
      {
        session,
      },
    );

    const productUpdatePromises = isOrder.product.map(async singleProduct => {
      await Product.findOneAndUpdate(
        { _id: singleProduct.productId },
        { $inc: { sellCount: singleProduct.quantity } },
        { session },
      );
    });

    await Promise.all(productUpdatePromises);

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  const result = await Order.findById(id);
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
  deleteOrder,
  myPendingOrders,
  myCompletedOrder,
  acceptOrder,
  cancelOrder,
  deliveredOrder,
};
