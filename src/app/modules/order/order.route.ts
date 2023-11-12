import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder,
);

// router.delete('/delete/:id', auth(), OrderController.deleteOrder);

// router.get('/my-pending-orders', auth(), OrderController.myPendingOrders);

// router.get('/my-completed-order', auth(), OrderController.myCompletedOrder);

// router.patch(
//   '/accept/:id',
//   auth(ENUM_USER_ROLE.ADMIN),
//   OrderController.acceptOrder,
// );

// router.patch(
//   '/cancel/:id',
//   auth(ENUM_USER_ROLE.ADMIN),
//   OrderController.cancelOrder,
// );

// router.patch(
//   '/delivered/:id',
//   auth(ENUM_USER_ROLE.ADMIN),
//   OrderController.deliveredOrder,
// );

router.get(
  '/all-pending-orders',
  auth(ENUM_USER_ROLE.ADMIN),
  OrderController.allPendingOrders,
);

router.get(
  '/all-accepted-orders',
  auth(ENUM_USER_ROLE.ADMIN),
  OrderController.allAcceptedOrders,
);

router.get(
  '/all-delivered-orders',
  auth(ENUM_USER_ROLE.ADMIN),
  OrderController.allDeliveredOrders,
);

export const OrderRouters = router;
