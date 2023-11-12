import { z } from 'zod';
const productSchema = z.object({
  productId: z.string({
    required_error: 'Product ID is required',
  }),
  productName: z.string({
    required_error: 'Product Name is required',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
    })
    .refine(value => value >= 0, {
      message: 'Must be positive.',
    }),
  price: z
    .number({
      required_error: 'Price is required',
    })
    .refine(value => value >= 0, {
      message: 'price must be positive',
    }),
});

const createOrderZodSchema = z.object({
  body: z
    .object({
      details: z.object(
        {
          name: z.string({
            required_error: 'Name is required',
          }),
          phoneNumber: z
            .string({
              required_error: 'Phone number is required',
            })
            .min(11)
            .max(14),
          district: z.string({
            required_error: 'District is required',
          }),
          address: z.string({
            required_error: 'Address is required',
          }),
          information: z.string({
            required_error: 'Information is required',
          }),
        },
        {
          required_error: 'Product is required',
        },
      ),
      product: z
        .array(productSchema, {
          required_error: 'Product is required',
        })
        .refine(data => data.length > 0, {
          message: 'At least one product is required',
        }),
      shippingCost: z
        .number({
          required_error: 'Shipping cost is required',
        })
        .refine(value => value >= 0, {
          message: 'Cost must be positive',
        }),
    })
    .strict(),
});

export const OrderValidation = {
  createOrderZodSchema,
};
