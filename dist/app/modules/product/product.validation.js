"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const product_constant_1 = require("./product.constant");
const createProductZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        proId: zod_1.z.string().optional(),
        name: zod_1.z.string({
            required_error: 'Product name is required',
        }),
        imgURL: zod_1.z.string({
            required_error: 'Image is required',
        }),
        category: zod_1.z.enum([...product_constant_1.categoriesList], {
            required_error: 'Category is required',
        }),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
        })
            .refine(value => value >= 1, {
            message: 'Price must be at least 1',
        }),
        size: zod_1.z.array(zod_1.z.enum([...product_constant_1.sizesList])).optional(),
        shortDescription: zod_1.z.string({
            required_error: 'Sort description is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        facebookURL: zod_1.z.string().optional(),
        availability: zod_1.z.boolean().optional(),
    })
        .strict(),
});
const updateProductZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        proId: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        imgURL: zod_1.z.string().optional(),
        category: zod_1.z.enum([...product_constant_1.categoriesList]).optional(),
        price: zod_1.z
            .number()
            .refine(value => value >= 1, {
            message: 'Price must be at least 1',
        })
            .optional(),
        size: zod_1.z
            .object({
            size: zod_1.z.string().optional(),
            chest: zod_1.z.string().optional(),
            length: zod_1.z.string().optional(),
            sleeve: zod_1.z.string().optional(),
        })
            .optional(),
        description: zod_1.z.string().optional(),
        facebookURL: zod_1.z.string().optional(),
        availability: zod_1.z.boolean().optional(),
    })
        .strict(),
});
const postReviewSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        review: zod_1.z.string({
            required_error: 'Review is required',
        }),
    })
        .strict(),
});
exports.ProductValidation = {
    createProductZodSchema,
    updateProductZodSchema,
    postReviewSchema,
};
