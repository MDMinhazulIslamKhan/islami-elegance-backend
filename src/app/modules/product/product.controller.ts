import { Request, Response, RequestHandler } from 'express';
import { ProductService } from './product.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant';
import { productFilterableField } from './product.constant';

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ProductService.getAllProducts(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All products retrieved Successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.getSingleProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved Successfully.',
    data: result,
  });
});

const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(
      req.body,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Product created Successfully!!!',
    });
  },
);

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.updateProduct(
    id,
    req.body,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Updated Successfully.',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.deleteProduct(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Deleted Successfully.',
    data: result,
  });
});

const postReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.postReview(
    id,
    req.user as UserInfoFromToken,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review Post Successfully.',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.deleteReview(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review Deleted Successfully.',
    data: result,
  });
});

export const ProductController = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  postReview,
  deleteReview,
};
