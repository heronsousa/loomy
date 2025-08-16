import { z } from "zod";

export const addAddressSchema = z.object({
  email: z.email("E-mail inválido."),
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
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

export type AddAddressSchema = z.infer<typeof addAddressSchema>;