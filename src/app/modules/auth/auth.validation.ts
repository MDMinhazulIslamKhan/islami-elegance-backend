import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z
    .object({
      fullName: z.string({
        required_error: 'fullName is required',
      }),
      email: z.string().email({ message: 'Invalid email format' }).optional(),
      phoneNumber: z
        .string({
          required_error: 'phoneNumber is required',
        })
        .min(11)
        .max(14),
      password: z
        .string({
          required_error: 'password is required',
        })
        .min(3)
        .max(15),
    })
    .strict(),
});

const loginUserZodSchema = z.object({
  body: z
    .object({
      phoneNumber: z.string({
        required_error: 'phoneNumber is required',
      }),
      password: z.string({
        required_error: 'password is required',
      }),
    })
    .strict(),
});

const updateUserZodSchema = z.object({
  body: z
    .object({
      fullName: z.string().optional(),
      email: z.string().email({ message: 'Invalid email format' }).optional(),
    })
    .strict(),
});

const changePasswordZodSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string({
          required_error: 'Old password is required',
        })
        .min(3)
        .max(15),
      newPassword: z
        .string({
          required_error: 'New password is required',
        })
        .min(3)
        .max(15),
    })
    .strict(),
});

const changePasswordByAdminZodSchema = z.object({
  body: z
    .object({
      newPassword: z
        .string({
          required_error: 'New password is required',
        })
        .min(3)
        .max(15),
    })
    .strict(),
});
export const AuthValidation = {
  createUserZodSchema,
  loginUserZodSchema,
  updateUserZodSchema,
  changePasswordZodSchema,
  changePasswordByAdminZodSchema,
};
