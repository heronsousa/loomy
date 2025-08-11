import { z } from "zod";

export const removeProductCartSchema = z.object({
  cartItemId: z.uuid(),
});

export type RemoveCartProductSchema = z.infer<typeof removeProductCartSchema>;