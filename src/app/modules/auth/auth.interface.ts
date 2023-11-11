import { Model } from 'mongoose';
import { Role } from './auth.constant';

export type IUser = {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  password: string;
  role: Role;
  complectedOrder: number;
  totalCost: number;
};

export type UserModel = {
  isUserExist(
    phoneNumber: string,
  ): Promise<Pick<IUser, 'id' | 'phoneNumber' | 'email' | 'password' | 'role'>>;

  isPasswordMatch(
    givenPassword: string,
    savePassword: string,
  ): Promise<boolean>;
} & Model<IUser>;

export type ILoginRequest = {
  phoneNumber: string;
  password: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
