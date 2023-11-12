import { Request, Response, RequestHandler } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant';
import { orderFilterableField } from './order.constant';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.createOrder(
      req.body,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Order created Successfully!!!',
    });
  },
);

const allPendingOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrderService.allPendingOrders(
    filters,
    paginationOptions,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Pending Orders retrieved Successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const allAcceptedOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrderService.allAcceptedOrders(
    filters,
    paginationOptions,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Accepted Orders retrieved Successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const allDeliveredOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrderService.allDeliveredOrders(
    filters,
    paginationOptions,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Delivered Orders retrieved Successfully.',
    meta: result.meta,
    data: result.data,
  });
});
export const OrderController = {
  createOrder,
  allPendingOrders,
  allDeliveredOrders,
  allAcceptedOrders,
};
