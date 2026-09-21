import { z } from "zod";

export const stockMovementSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Select a Product."),

  type: z.enum(["IN", "OUT"]),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than 0."),
});