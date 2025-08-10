import { z } from "zod";

export const addCartProductsSchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number().int().min(1).default(1),
}); 

export type AddCartProductsSchema = z.infer<typeof addCartProductsSchema>;