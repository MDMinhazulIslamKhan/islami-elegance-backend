import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IChangePassword, ILoginRequest, IUser } from './auth.interface';
import User from './auth.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import {
  IGenericResponse,
  IPaginationOptions,
  UserInfoFromToken,
} from '../../../interfaces/common';
import { userFilterableField } from './auth.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const checkNumber = await User.findOne({ phoneNumber: user.phoneNumber });
  if (user.email) {
    console.log(12);
    const checkEmail = await User.findOne({ email: user.email });
    if (checkEmail) {
      throw new ApiError(httpStatus.CONFLICT, 'Already used this email!!!');
    }
  }
  if (checkNumber) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already used this phone number!!!',
    );
  }
  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'Failed to create user!');
  }
  const result = await User.findById(createdUser._id);
  return result;
};

const loginUser = async (payload: ILoginRequest): Promise<string> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist.");
  }

  if (!(await User.isPasswordMatch(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect.');
  }

  const { role, id } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, phoneNumber, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return accessToken;
};

const changePassword = async (
  userInfo: UserInfoFromToken,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findById(userInfo.id).select({
    password: true,
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!(await User.isPasswordMatch(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }
  isUserExist.password = newPassword;
  isUserExist.save();
};

const getOwnProfile = async (
  userInfo: UserInfoFromToken,
): Promise<IUser | null> => {
  const result = await User.findById(userInfo.id);
  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile is not exist!!!');
  }
  return result;
};

const updateOwnProfile = async (
  payload: Partial<IUser>,
  userInfo: UserInfoFromToken,
): Promise<IUser | null> => {
  const isUserExist = await User.findById(userInfo.id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (payload.email) {
    const checkEmail = await User.findOne({
      email: payload.email,
    });

    if (checkEmail) {
      throw new ApiError(httpStatus.CONFLICT, 'Already used this email!!!');
    }
  }

  const result = await User.findOneAndUpdate({ _id: userInfo.id }, payload, {
    new: true,
  });
  return result;
};

const getAllUsers = async (
  filters: { searchTerm?: string },
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // for filter data
  if (searchTerm) {
    andConditions.push({
      $or: userFilterableField.map(field => ({
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
  const result = await User.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await User.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'User is not exist!!!');
  }
  return result;
};

const changePasswordByAdmin = async (
  id: string,
  payload: IChangePassword,
): Promise<void> => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  isUserExist.password = payload.newPassword;
  isUserExist.save();
};
export const AuthService = {
  createUser,
  loginUser,
  changePassword,
  getOwnProfile,
  updateOwnProfile,
  getAllUsers,
  getSingleUser,
  changePasswordByAdmin,
};
