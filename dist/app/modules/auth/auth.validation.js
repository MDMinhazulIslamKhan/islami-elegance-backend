"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        fullName: zod_1.z.string({
            required_error: 'fullName is required',
        }),
        email: zod_1.z.string().email({ message: 'Invalid email format' }).optional(),
        phoneNumber: zod_1.z
            .string({
            required_error: 'phoneNumber is required',
        })
            .min(11)
            .max(14),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(3)
            .max(15),
    })
        .strict(),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        phoneNumber: zod_1.z.string({
            required_error: 'phoneNumber is required',
        }),
        password: zod_1.z.string({
            required_error: 'password is required',
        }),
    })
        .strict(),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        fullName: zod_1.z.string().optional(),
        email: zod_1.z.string().email({ message: 'Invalid email format' }).optional(),
    })
        .strict(),
});
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        oldPassword: zod_1.z
            .string({
            required_error: 'Old password is required',
        })
            .min(3)
            .max(15),
        newPassword: zod_1.z
            .string({
            required_error: 'New password is required',
        })
            .min(3)
            .max(15),
    })
        .strict(),
});
const changePasswordByAdminZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        newPassword: zod_1.z
            .string({
            required_error: 'New password is required',
        })
            .min(3)
            .max(15),
    })
        .strict(),
});
exports.AuthValidation = {
    createUserZodSchema,
    loginUserZodSchema,
    updateUserZodSchema,
    changePasswordZodSchema,
    changePasswordByAdminZodSchema,
};
