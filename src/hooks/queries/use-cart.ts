import { useQuery } from "@tanstack/react-query";

type Cart = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  shippingAddressId: string | null;
  isCompleted: boolean;
  items: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    cartId: string;
    productVariantId: string;
    quantity: number;
    productVariant: {
      name: string;
      id: string;
      createdAt: Date;
      color: string;
      imageUrl: string;
      priceInCents: number;
      slug: string;
      productId: string;
      product: {
        name: string;
        id: string;
        createdAt: Date;
        slug: string;
        description: string;
        categoryId: string;
      };
    };
  }[];
  totalPriceInCents: number;
};

const getCart = async () => {
  const res = await fetch("/api/cart");

  if (!res.ok) throw new Error("Error fetching cart");

  return res.json() as Promise<Cart>;
};

export const getUseCartQueryKey = () => ["cart"] as const;

export const useCart = () => {
  return useQuery({
    queryKey: getUseCartQueryKey(),
    queryFn: getCart,
  });
};