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

const deleteOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OrderService.deleteOrder(
      id,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Order deleted Successfully!!!',
    });
  },
);

const myPendingOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.myPendingOrders(
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Pending Orders retrieved Successfully.',
    data: result,
  });
});

const myCompletedOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.myCompletedOrder(
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Completed Orders retrieved Successfully.',
    data: result,
  });
});

const acceptOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await OrderService.acceptOrder(
      id,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order accepted Successfully.',
      data: result,
    });
  },
);

const cancelOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await OrderService.cancelOrder(
      id,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order cancel Successfully.',
      data: result,
    });
  },
);

const deliveredOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await OrderService.deliveredOrder(
      id,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order delivered Successfully.',
      data: result,
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
  deleteOrder,
  myPendingOrders,
  myCompletedOrder,
  acceptOrder,
  cancelOrder,
  deliveredOrder,
};
