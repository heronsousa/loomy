import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCep = async (cep: string) => {
  try {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) throw new Error("CEP inválido");
  
    const { data }  = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    return data;
  } catch (error) {
    console.error(error)
  }
};

export const getUseCepQueryKey = (cep: string) => ["cep", cep] as const;

export const useCep = (cep: string) => {
  return useQuery({
    queryKey: getUseCepQueryKey(cep),
    queryFn: () => fetchCep(cep),
    enabled: cep.replace(/\D/g, "").length === 8,
  });
};