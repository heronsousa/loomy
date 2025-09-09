'use client';

import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { useAddCartProducts } from "@/hooks/mutations/use-add-to-cart";
import { useDecreaseProductFromCart } from "@/hooks/mutations/use-decrease-product-from-cart";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";
import { formatCentsToBRL } from "@/utils/money";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  quantity: number;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
}

const CartItem = ({
  id,
  quantity,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
}: CartItemProps) => {
  const removeProduct = useRemoveProductFromCart(id);
  const decreaseProduct = useDecreaseProductFromCart(id);
  const incrementQuantity = useAddCartProducts(productVariantId);

  const handleRemove = () => {
    removeProduct.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido do carrinho.");
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho.");
      },
    });
  };

  const handleDecrease = () => {
    decreaseProduct.mutate(undefined, {
      onError: () => {
        toast.success("Erro ao diminuir quantidade do produto");
      },
    });
  };

  const handleIncrement = () => {
    incrementQuantity.mutate(1, {
      onError: () => {
        toast.success("Erro ao aumentar quantidade do produto");
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleDecrease}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleIncrement}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleRemove}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
};
 
export default CartItem;