import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";

class UsuarioService {

    async cadastrar(nome, email, senhaDescrip) {
        if(!nome || !email || !senhaDescrip) {
            const error = new Error('Nome, e-mail e senha são obrigatórios.');
            error.statusCode = 400
            throw error;
        }
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { email }
        });
        if(usuarioExiste) {
            const error = new Error('Este e-mail já está em uso!');
            error.statusCode = 409; 
            throw error;
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
            const error = new Error("E-mail e senha são obrigatórios!");
            error.statusCode = 400
            throw error;
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });
        if(!usuario) {
            const error = new Error("E-mail ou senha inválidos!");
            error.statusCode = 401;
            throw error;
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if(!senhaValida) {
            const error = new Error("E-mail ou senha inválidos!");
            error.statusCode = 404;
            throw error;
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
            const error = new Error("Usuário não encontrado!");
            error.statusCode = 404;
            throw error;
        }

        await prisma.usuario.delete({
            where: { id: usuarioId },
        });

        return { message: "Usuário deletado com sucesso!" };
    }
}

export default UsuarioService;