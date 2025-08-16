"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAddress } from "@/actions/add-address";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAddresses } from "@/actions/get-address";
import { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";
import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { useRouter } from "next/navigation";

interface AddressProps {
  defaultShippingAddressId: string | null;
}

const addressSchema = z.object({
  email: z.string().email("E-mail inválido."),
  firstName: z.string().min(1, "Primeiro nome é obrigatório."),
  lastName: z.string().min(1, "Sobrenome é obrigatório."),
  cpf: z.string().min(14, "CPF/CNPJ inválido."),
  phone: z.string().min(14, "Celular inválido."),
  zipCode: z.string().min(9, "CEP inválido."),
  address: z.string().min(1, "Endereço é obrigatório."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(1, "Estado é obrigatório."),
});

type FormValues = z.infer<typeof addressSchema>;

const getCpfCnpjMask = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length > 11) {
    return "##.###.###/####-##";
  }
  return "###.###.###-##";
};

const Addresses = ({ defaultShippingAddressId }: AddressProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId,
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateCartAddress,
    isPending: isUpdateCartAddressPending,
  } = useMutation({
    mutationKey: ["update-cart-shipping-address"],
    mutationFn: (data: UpdateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const { mutateAsync: createAddress, isPending: isCreateAddressPending } =
    useMutation({
      mutationKey: ["create-shipping-address"],
      mutationFn: addAddress,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-addresses"],
        });
      },
    });

  const { data: addresses = [] } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => await getAddresses(),
  });

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newAddress = await createAddress(values);
      toast.success("Endereço criado com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);

      await updateCartAddress({
        shippingAddressId: newAddress.id,
      });
    } catch (error) {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error(error);
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await updateCartAddress({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço selecionado para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={selectedAddress || undefined}
          onValueChange={setSelectedAddress}
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>

          {addresses.map((address: any) => (
            <Card key={address.id}>
              <CardContent>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <Label htmlFor={address.id} className="font-semibold">
                    {address.recipientName} - {address.street}, {address.number}{" "}
                    - {address.city}/{address.state}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-4">
            <Button
              onClick={handleGoToPayment}
              className="w-full"
              disabled={isUpdateCartAddressPending}
            >
              {isUpdateCartAddressPending
                ? "Processando..."
                : "Ir para pagamento"}
            </Button>
          </div>
        )}

        {selectedAddress === "add_new" && (
          <Form {...form}>
            <form
              className="mt-8 space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Primeiro nome"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Sobrenome"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <PatternFormat
                          {...field}
                          customInput={Input}
                          format={getCpfCnpjMask(field.value)}
                          mask="_"
                          placeholder="CPF/CNPJ"
                          className="h-12"
                          value={field.value}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <PatternFormat
                          {...field}
                          customInput={Input}
                          format="(##) #####-####"
                          mask="_"
                          placeholder="Celular"
                          value={field.value}
                          className="h-12"
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PatternFormat
                        {...field}
                        customInput={Input}
                        format="#####-###"
                        mask="_"
                        placeholder="CEP"
                        className="h-12"
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Endereço"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Número"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Complemento"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Bairro"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Cidade"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Estado"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isUpdateCartAddressPending || isCreateAddressPending}
              >
                Salvar endereço
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
