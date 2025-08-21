import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getUseCartQueryKey } from "../queries/use-cart";
import axios from "axios";

const decreaseProductFromCart = async (cartItemId: string) => {
  try {
    const { data } = await axios.post("/api/cart/decrease", {
      cartItemId
    });
    
    return data;
  } catch (error) {
    console.error(error)
    throw new Error("Error decrease product from cart");
  }
}

export const getDecreaseProductFromCartMutationKey = (cartItemId: string) =>
  ["decrease-cart-product", cartItemId] as const;

export const useDecreaseProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getDecreaseProductFromCartMutationKey(cartItemId),
    mutationFn: async () => await decreaseProductFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};