import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";

class UsuarioService {

    async cadastrar(nome, email, senhaDescrip) {
        if(!nome || !email || !senhaDescrip) {
            throw new Error('Nome, e-mail e senha são obrigatórios.');
        }
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { email }
        });
        if(usuarioExiste) {
            throw new Error('Este e-mail já está em uso!');
        }

        const salt = await bcrypt.genSalt(10);
        const senha = await bcrypt.hash(senhaDescrip, salt);

        return await prisma.usuario.create({
            data: { nome, email, senha },
            select: { id: true, nome: true, email: true, criadoEm: true }
        });

    };

    async login(email, senha) {
        if(!email || !senha) {
            throw new Error ("E-mail e senha são obrigatórios!");
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });
        if(!usuario) {
            throw new Error("E-mail ou senha inválidos!");
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if(!senhaValida) {
            throw new Error("E-mail ou senha inválidos!");
        }

        const secret = process.env.JWT_SECRET || "default_secret";
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email }, secret,
            { expiresIn: "1d" }
        );

        return {
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
            token,
        };
    }

    async listar() {
        return await prisma.usuario.findMany({
            select: {
                id: true, nome: true, email: true, criadoEm: true
            }
        })
    };

    async deletar(id) {
        const usuarioId = Number(id);
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if(!usuarioExiste) {
            throw new Error("Usuário não encontrado!");
        }

        await prisma.usuario.delete({
            where: { id: usuarioId },
        });

        return { message: "Usuário deletado com sucesso!" };
    }
}

export default UsuarioService;