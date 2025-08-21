import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getUseCartQueryKey } from "../queries/use-cart";
import axios from "axios";

const removeProductFromCart = async (cartItemId: string) => {
  try {
    const { data } = await axios.post("/api/cart/remove", {
      cartItemId
    });
    
    return data;
  } catch (error) {
    console.error(error)
    throw new Error("Error remove product from cart");
  }
}

export const getRemoveProductFromCartMutationKey = (cartItemId: string) =>
  ["remove-cart-product", cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getRemoveProductFromCartMutationKey(cartItemId),
    mutationFn: async () => await removeProductFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};