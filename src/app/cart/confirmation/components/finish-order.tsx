"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finishOrder } from '@/actions/finish-order'

const FinishOrder = () => {
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: finishOrderMutation, isPending } = useMutation({
    mutationKey: ["finish-order"],
    mutationFn: () => finishOrder(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleFinishOrder = () => {
    finishOrderMutation();
    setSuccessDialogIsOpen(true);
  };
  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={isPending}
      >
        {isPending && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Finalizar compra
      </Button>
      <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogIsOpen}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">Pedido efetuado!</DialogTitle>
          <DialogDescription className="font-medium">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de “Meus Pedidos”.
          </DialogDescription>

          <DialogFooter>
            <Button className="rounded-full" size="lg">
              Ver meus pedidos
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinishOrder;