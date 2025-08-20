"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addCartProducts } from "@/modules/cart";

interface AddToCartProps {
  productVariantId: string;
  quantity: number;
}

export const AddToCart = ({ productVariantId, quantity }: AddToCartProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-to-cart", productVariantId, quantity],
    mutationFn: () => addCartProducts({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return (
    <Button
      className="rounded-full"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate()}
    > 
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar à sacola
    </Button>
  );
};

