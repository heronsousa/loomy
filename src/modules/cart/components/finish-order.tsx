"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { finishOrder, createCheckoutSession } from "@/modules/checkout";
import { Button } from "@/components/ui/button";

export const FinishOrder = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: finishOrderMutation, isPending } = useMutation({
    mutationKey: ["finish-order"],
    mutationFn: async () => await finishOrder(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleFinishOrder = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key is not set");
    }

    const { orderId } = await finishOrderMutation();

    const checkoutSession = await createCheckoutSession({ orderId });

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    );

    if (!stripe) {
      throw new Error("Failed to load Stripe");
    }

    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
  };

  return (
    <Button
      className="w-full rounded-full"
      size="lg"
      onClick={handleFinishOrder}
      disabled={isPending}
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      Finalizar compra
    </Button>
  );
};
