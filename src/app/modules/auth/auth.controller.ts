import { Request, Response, RequestHandler } from 'express';
import { AuthService } from './auth.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';
import pick from '../../../shared/pick';
import { userFilterableField } from './auth.constant';
import { paginationFields } from '../../../constant';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'User created Successfully!!!',
    });
  },
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: { accessToken: result },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req?.user;

  await AuthService.changePassword(userInfo as UserInfoFromToken, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
  });
});

const getOwnProfile = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req?.user;

  const result = await AuthService.getOwnProfile(userInfo as UserInfoFromToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully!',
    data: result,
  });
});

const updateOwnProfile = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req?.user;

  const result = await AuthService.updateOwnProfile(
    req.body,
    userInfo as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableField);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await AuthService.getAllUsers(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users retrieved Successfully!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AuthService.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  });
});

const changePasswordByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AuthService.changePasswordByAdmin(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password changed successfully!',
      data: result,
    });
  },
);

export const AuthController = {
  createUser,
  loginUser,
  changePassword,
  getOwnProfile,
  updateOwnProfile,
  getAllUsers,
  getSingleUser,
  changePasswordByAdmin,
};
