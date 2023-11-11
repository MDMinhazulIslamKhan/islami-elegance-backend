import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './auth.interface';
import { userRoles } from './auth.constant';
import config from '../../../config';

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
      default: 'user',
    },
    complectedOrder: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isUserExist = async function (
  phoneNumber: string,
): Promise<Pick<
  IUser,
  'id' | 'email' | 'phoneNumber' | 'password' | 'role'
> | null> {
  return await User.findOne(
    { phoneNumber },
    { email: 1, password: 1, role: 1 },
  );
};

userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savePassword);
};

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
