'use client';

import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/actions/get-cart";

const CartMenu = () => {
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => getCart(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          {cart?.items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <img src={item.productVariant.imageUrl} alt={item.productVariant.name} className="w-12 h-12 rounded" />
                <div>
                  <h4 className="font-semibold">{item.productVariant.name}</h4>
                  <span className="text-sm text-muted-foreground">Quantidade: {item.quantity}</span>
                </div>
              </div>
              <span className="font-semibold">R$ {item.productVariant.priceInCents / 100}</span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartMenu;
