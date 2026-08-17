import { describe, it, expect, vi, beforeEach } from "vitest";
import UsuarioService from "./usuario.service.js";
import prisma from "../database/prisma.js";
import bcrypt from "bcryptjs";

vi.mock('../database/prisma.js', () => ({
    default: {
        usuario: {
            findFirst: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }
    }
}));

describe('UsuarioService - Testes Unitários', () => {
    let usuarioService;

    beforeEach(() => {
        usuarioService = new UsuarioService();
        vi.clearAllMocks();
    });

    describe('cadastrar()', () => {
        it('Deve lançar um erro 400 caso nome, email ou senha não sejam inseridos', async () => {
            let nome = 'Thales';
            let email = 'thales@paloski.com'
            let senhaDescrip;
            
            prisma.usuario.findUnique.mockResolvedValue(null)
            await expect(usuarioService.cadastrar(nome, email, senhaDescrip)).rejects.toThrow(/^Nome, e-mail e senha são obrigatórios.$/);
        });

        it('Deve lançar um erro 409 por utilizar email existente', async () => {
            let email = 'thales@teste.com';
            let senhaDescrip = 'testesenha';
            let nome = 'Thales';
            prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome, email });

            await expect(usuarioService.cadastrar(nome, email, senhaDescrip)).rejects.toThrow(/^Este e-mail já está em uso!$/);
            expect(prisma.usuario.create).not.toHaveBeenCalled();
        });

        it('Deve cadastrar um usuário quando todos os dados estiverem válidos', async () => {
            const nome = 'Thales';
            const email = 'thales@test.com';
            const senha = 'thalestestesenha';
            prisma.usuario.findUnique.mockResolvedValue(null);
            const usuarioCriadoMock = { id: 1, nome, email, criadoEm: new Date() };
            prisma.usuario.create.mockResolvedValue(usuarioCriadoMock);

            const resultado = await usuarioService.cadastrar(nome, email, senha);

            expect(resultado).toEqual(usuarioCriadoMock);
            expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email }});
            expect(prisma.usuario.create).toHaveBeenCalled();
        });
    });

    describe('login()', () => {
        it('Deve lançar erro 400 se e-mail ou senha não forem informados', async () => {
            await expect(usuarioService.login('', 'senha123' )).rejects.toThrow('E-mail e senha são obrigatórios!');
            expect(prisma.usuario.findUnique).not.toHaveBeenCalled();
        });

        it('Deve lançar erro 401 se e-mail não for encotrado ou senha inválida', async () => {
            prisma.usuario.findUnique.mockResolvedValue(null);

            await expect(usuarioService.login('inexistente@.com', 'Inex&123456')).rejects.toThrow('E-mail ou senha inválidos!');
            expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'inexistente@.com' }});
        });

        it('Deve realizar o login com sucesso e retornar o usuário com o token', async () => {
            const senhaDescrip = 'senhaSegura123&';
            //gerando hash real rapido para comparação do service funcionar sem erro
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senhaDescrip, salt);

            const usuarioMock = { id: 1, nome: 'UserTest', email: 'usertest@test.com', senha: senhaHash };
            prisma.usuario.findUnique.mockResolvedValue(usuarioMock);

            const resultado = await usuarioService.login('usertest@test.com', senhaDescrip);

            expect(resultado).toHaveProperty('token');
            expect(resultado.usuario).toEqual({ id: 1, nome: 'UserTest', email: 'usertest@test.com' });
            expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'usertest@test.com' } });
        });
    });
});