import { z } from "zod";

export const validadorCadastroProduto = z.object({
    nome: z.string().trim().min(3, { message: "O nome precisa de no mínimo 3 caracteres."}),
    descricao: z.string().trim().optional(),
    preco: z.number().positive({ message: "O preço precisa ser um valor positivo." }),
    qtd_estoque: z.number().int("A quantidade de estoque precisa ser um número inteiro.").nonnegative("A quantidade precisa ser positiva.")
});

export const validadorAtualizarProduto = validadorCadastroProduto.partial();