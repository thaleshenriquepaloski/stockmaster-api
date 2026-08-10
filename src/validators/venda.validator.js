import { z } from "zod";

export const validadorCadastroVenda = z.object({
    produto_id: z.number().int().positive("ID de produto inválido!"), 
    qtd_vendida: z.number().int().positive("Quantidade de produto precisa ser de no mínimo 1 unidade.")
});