'use client';

import { addCartProducts } from "@/actions/add-cart-produts";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface AddToCartProps {
  productVariantId: string;
  quantity: number;
}

const AddToCart = ({ productVariantId, quantity }: AddToCartProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-to-cart", productVariantId, quantity],
    mutationFn: () => addCartProducts({productVariantId, quantity}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return (
    <Button className="rounded-full" variant="outline" disabled={isPending} onClick={() => mutate()}>
      {isPending && <Loader2 className="animate-spin"/>}
      Adicionar à sacola
    </Button>
  );
}
 
export default AddToCart;