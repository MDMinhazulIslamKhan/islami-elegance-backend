import { z } from 'zod';
import { categoriesList, sizesList } from './product.constant';

const createProductZodSchema = z.object({
  body: z
    .object({
      proId: z.string().optional(),
      name: z.string({
        required_error: 'Product name is required',
      }),
      imgURL: z.string({
        required_error: 'Image is required',
      }),
      category: z.enum([...categoriesList] as [string, ...string[]], {
        required_error: 'Category is required',
      }),
      price: z
        .number({
          required_error: 'Price is required',
        })
        .refine(value => value >= 1, {
          message: 'Price must be at least 1',
        }),
      size: z.array(z.enum([...sizesList] as [string, ...string[]])).optional(),
      shortDescription: z.string({
        required_error: 'Sort description is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }),
      facebookURL: z.string().optional(),
      availability: z.boolean().optional(),
    })
    .strict(),
});

const updateProductZodSchema = z.object({
  body: z
    .object({
      proId: z.string().optional(),
      name: z.string().optional(),
      imgURL: z.string().optional(),
      category: z.enum([...categoriesList] as [string, ...string[]]).optional(),
      price: z
        .number()
        .refine(value => value >= 1, {
          message: 'Price must be at least 1',
        })
        .optional(),
      size: z
        .object({
          size: z.string().optional(),
          chest: z.string().optional(),
          length: z.string().optional(),
          sleeve: z.string().optional(),
        })
        .optional(),
      description: z.string().optional(),
      facebookURL: z.string().optional(),
      availability: z.boolean().optional(),
    })
    .strict(),
});

const postReviewSchema = z.object({
  body: z
    .object({
      review: z.string({
        required_error: 'Review is required',
      }),
    })
    .strict(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
  postReviewSchema,
};
