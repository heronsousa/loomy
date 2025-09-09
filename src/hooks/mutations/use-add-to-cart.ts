import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { getUseCartQueryKey } from "../queries/use-cart";

const addProductToCart = async (productVariantId: string, quantity: number) => {
  try {
    const { data } = await axios.post("/api/cart/add", {
      productVariantId, quantity
    });
    
    return data;
  } catch (error) {
    console.error(error)
    throw new Error("Error add product to cart");
  }
}

export const getAddCartProductsMutationKey = (productVariantId: string) =>
  ["add-cart-products", productVariantId] as const;

export const useAddCartProducts = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getAddCartProductsMutationKey(productVariantId),
    mutationFn: async (quantity: number) => await addProductToCart(productVariantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
