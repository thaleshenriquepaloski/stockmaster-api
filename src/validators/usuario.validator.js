import { z } from "zod";

export const validadorCadastroUsuario = z.object({
    nome: z
    .string({ required_error: "O nome é obrigatório", invalid_type_error: "O nome precisa ser uma String" })
    .trim()
    .min(3, { message: "O nome precisa de no mínimo 3 caracteres" }),

    email: z
    .string({ required_error: "O e-mail é obrigatório!"})
    .trim()
    .email({ message: "Formato de e-mail inválido!" }),

    senha: z
    .string({ required_error: "A senha é obrigatória", invalid_type_error: "A senha precisa ser uma String"})
    .min(6, { message: "A senha precisa de no mínimo 6 caracteres"}),
});

export const validadorLoginUsuario = z.object({
    email: z.string().email({ message: "E-mail inválido!" }),
    senha: z.string().min(1 , { message: "A senha é obrigatória"})
});


