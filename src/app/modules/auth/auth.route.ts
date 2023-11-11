import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.createUserZodSchema),
  AuthController.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginUserZodSchema),
  AuthController.loginUser,
);

router.patch(
  '/change-password',
  auth(),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword,
);

router.get('/profile', auth(), AuthController.getOwnProfile);

router.patch(
  '/profile',
  auth(),
  validateRequest(AuthValidation.updateUserZodSchema),
  AuthController.updateOwnProfile,
);

router.get(
  '/all-users',
  auth(ENUM_USER_ROLE.ADMIN),
  AuthController.getAllUsers,
);

router.get(
  '/user/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  AuthController.getSingleUser,
);

router.patch(
  '/change-password-by-admin/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AuthValidation.changePasswordByAdminZodSchema),
  AuthController.changePasswordByAdmin,
);

export const AuthRouters = router;
