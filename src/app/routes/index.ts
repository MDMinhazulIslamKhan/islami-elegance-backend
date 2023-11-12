import express from 'express';
import { AuthRouters } from '../modules/auth/auth.route';
import { ProductRouters } from '../modules/product/product.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouters,
  },
  {
    path: '/product',
    route: ProductRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const ApplicationRouters = router;
