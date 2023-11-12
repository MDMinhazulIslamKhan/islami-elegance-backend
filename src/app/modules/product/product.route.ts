import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/single-product/:id', ProductController.getSingleProduct);
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct,
);

router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct,
);

router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct,
);

router.post(
  '/review/:id',
  validateRequest(ProductValidation.postReviewSchema),
  auth(),
  ProductController.postReview,
);

router.delete('/review/:id', auth(), ProductController.deleteReview);

export const ProductRouters = router;
