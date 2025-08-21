"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAddCartProducts } from "@/hooks/mutations/use-add-to-cart";

interface AddToCartProps {
  productVariantId: string;
  quantity: number;
}

export const AddToCart = ({ productVariantId, quantity }: AddToCartProps) => {
  const { mutate, isPending } = useAddCartProducts(productVariantId);

  return (
    <Button
      className="rounded-full"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(quantity)}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar à sacola
    </Button>
  );
};
