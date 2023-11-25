"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    productId: zod_1.z.string({
        required_error: 'Product ID is required',
    }),
    productName: zod_1.z.string({
        required_error: 'Product Name is required',
    }),
    quantity: zod_1.z
        .number({
        required_error: 'Quantity is required',
    })
        .refine(value => value >= 0, {
        message: 'Must be positive.',
    }),
    price: zod_1.z
        .number({
        required_error: 'Price is required',
    })
        .refine(value => value >= 0, {
        message: 'price must be positive',
    }),
});
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        details: zod_1.z.object({
            name: zod_1.z.string({
                required_error: 'Name is required',
            }),
            phoneNumber: zod_1.z
                .string({
                required_error: 'Phone number is required',
            })
                .min(11)
                .max(14),
            district: zod_1.z.string({
                required_error: 'District is required',
            }),
            address: zod_1.z.string({
                required_error: 'Address is required',
            }),
            information: zod_1.z.string({
                required_error: 'Information is required',
            }),
        }, {
            required_error: 'Product is required',
        }),
        product: zod_1.z
            .array(productSchema, {
            required_error: 'Product is required',
        })
            .refine(data => data.length > 0, {
            message: 'At least one product is required',
        }),
        shippingCost: zod_1.z
            .number({
            required_error: 'Shipping cost is required',
        })
            .refine(value => value >= 0, {
            message: 'Cost must be positive',
        }),
    })
        .strict(),
});
exports.OrderValidation = {
    createOrderZodSchema,
};
