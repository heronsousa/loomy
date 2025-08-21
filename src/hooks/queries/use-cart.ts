import { useQuery } from "@tanstack/react-query";

const getCart = async () => {
  const res = await fetch("/api/cart");

  if (!res.ok) throw new Error("Error fetching cart");

  return res.json();
}

export const getUseCartQueryKey = () => ["cart"] as const;

export const useCart = () => {
  return useQuery({
    queryKey: getUseCartQueryKey(),
    queryFn: getCart,
  });
};