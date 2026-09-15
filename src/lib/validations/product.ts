import { z } from "zod";

export const productSchema = z.object({
    name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters.")
    .max(100, "Product name must contain at most 100 characters."),

    sku: z
    .string()
    .trim()
    .max(50, "SKU must contain at most 50 characters.")
    .optional(),

    description: z
    .string()
    .trim()
    .max(500, "Description must contain at most 500 characters.")
    .optional(),

    price: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter a valid price with up to 2 decimal places.",)
    .refine((value) => Number(value) > 0, "Price must be greater than 0."),

    minimumStock: z.coerce
    .number()
    .int("Minimum stock must be a whole number.")
    .min(0, "Minimum stock cannot be negative."),

    categoryId: z
    .string()
    .trim()
    .optional(),
})