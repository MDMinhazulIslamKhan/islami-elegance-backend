import { IProduct, IProductFilters } from './product.interface';
import Product from './product.model';
import {
  IGenericResponse,
  IPaginationOptions,
  UserInfoFromToken,
} from '../../../interfaces/common';
import { SortOrder } from 'mongoose';
import User from '../auth/auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { productSearchableField } from './product.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';

const getAllProducts = async (
  filters: IProductFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IProduct[]>> => {
  const {
    searchTerm,
    lowestPrice = 0,
    availability,
    highestPrice = Infinity,
    ...filtersData
  } = filters;
  const andConditions = [];

  // for filter price
  andConditions.push({
    $and: [{ price: { $gte: lowestPrice } }, { price: { $lte: highestPrice } }],
  });

  // for availability
  if (availability != null && availability != 'null') {
    andConditions.push({
      $and: [{ availability: availability }],
    });
  }

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: productSearchableField.map(field => ({
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
  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(query)
    .sort(sortConditions)
    .skip(skip)
    .select({
      sellCount: 0,
    })
    .limit(limit)
    .populate({
      path: 'review',
      populate: [
        {
          path: 'userId',
          select: {
            fullName: true,
          },
        },
      ],
    });

  const count = await Product.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id)
    .select({
      sellCount: 0,
    })
    .populate({
      path: 'review',
      populate: [
        {
          path: 'userId',
          select: {
            fullName: true,
            phoneNumber: true,
          },
        },
      ],
    });

  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'Product is not exist!!!');
  }
  return result;
};

const createProduct = async (
  product: Partial<IProduct>,
  userInfo: UserInfoFromToken,
): Promise<IProduct | null> => {
  console.log(product);
  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const result = await Product.create(product);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create product!');
  }

  return result;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>,
  userInfo: UserInfoFromToken,
): Promise<IProduct | null> => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no product with this id!!!',
    );
  }

  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const result = await Product.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate({
    path: 'review',
    populate: [
      {
        path: 'userId',
        select: {
          fullName: true,
        },
      },
    ],
  });

  return result;
};

const deleteProduct = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IProduct | null> => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no product with this id!!!',
    );
  }

  const admin = await User.findById(userInfo.id);
  if (!admin) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const result = await Product.findByIdAndDelete(id);

  return result;
};

const postReview = async (
  id: string,
  userInfo: UserInfoFromToken,
  payload: { feedback: string },
): Promise<IProduct | null> => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no product with this id!!!',
    );
  }

  const user = await User.findById(userInfo.id);
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const checkReview = product.review.find(r => r.userId == userInfo.id);

  if (checkReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your already post a review!!!');
  }

  const review = { userId: userInfo.id, ...payload };

  const result = await Product.findOneAndUpdate(
    { _id: id },
    { $push: { review: review } },
    {
      new: true,
    },
  )
    .select({
      sellCount: 0,
    })
    .populate({
      path: 'review',
      populate: [
        {
          path: 'userId',
          select: {
            fullName: true,
          },
        },
      ],
    });

  return result;
};

const deleteReview = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no product with this id!!!',
    );
  }

  const user = await User.findById(userInfo.id);
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const result = await Product.findOneAndUpdate(
    { _id: id },
    { $pull: { review: { userId: userInfo.id } } },
    {
      new: true,
    },
  )
    .select({
      sellCount: 0,
    })
    .populate({
      path: 'review',
      populate: [
        {
          path: 'userId',
          select: {
            fullName: true,
          },
        },
      ],
    });

  return result;
};

export const ProductService = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  postReview,
  deleteReview,
};
