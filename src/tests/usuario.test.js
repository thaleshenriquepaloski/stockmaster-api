import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../database/prisma.js";
import bcrypt from "bcryptjs";

describe('Teste de Integração - Usuário e Auth', () => {
    beforeEach(async () => {
        await prisma.venda.deleteMany();
        await prisma.usuario.deleteMany();
    });

    describe('POST /auth/cadastro', () => {
        it('deve retornar 400 ao enviar dados inválidos', async () => {
            const resposta = await request(app)
                .post('/auth/cadastro')
                .send({});

            expect(resposta.status).toBe(400);
        });
        
        it('deve cadastrar um usuario ao enviar dados válidos', async () => {
            const resposta = await request(app)
                .post('/auth/cadastro')
                .send({
                    nome: 'Teste', email: 'dev@teste.com', senha: 'senhaTeste123$'
                });

            expect(resposta.status).toBe(201);
            expect(resposta.body).toHaveProperty('id');
        });
    });

    describe('POST /auth/login', () => {
        it('deve retornar um erro 400 caso email ou senha não sejam inseridos', async () => {
            const resposta = await request(app)
                .post('/auth/login')
                .send({});

            expect(resposta.status).toBe(400)
            expect(resposta).toHaveProperty('error');
        });

        it('deve retornar um erro 401 caso o email não seja encontrado', async () => {
            const resposta = await request(app)
                .post('/auth/login')
                .send({ email: 'notfound@email.com', senha: 'senhaTeste$' });

            expect(resposta.status).toBe(401);
            expect(resposta.body.erro).toMatch(/^E-mail ou senha inválidos!$/)
        });

        it('deve retornar um erro 404 caso a senha seja inválida', async () => {
            const senhaCriptografada = await bcrypt.hash('senhaCorreta123#', 10);

            await prisma.usuario.create({
                data: { nome: 'User Teste', email: 'testeuser@senha.com', senha: senhaCriptografada },
            });

            const resposta = await request(app)
                .post('/auth/login')
                .send({ email: 'testeuser@senha.com', senha: 'senhaDivergente123#' });
            
            expect(resposta.status).toBe(404);
            expect(resposta.body.erro).toMatch(/^E-mail ou senha inválidos!$/)
        });

        it('deve efetuar o login devolvendo o usuario e o token', async () => {
            const senhaCriptografada = await bcrypt.hash('senhaDoSucesso123#', 10);

            await prisma.usuario.create({
                data: { nome:'Usuario Aprovado', email: 'login@sucesso.com', senha: senhaCriptografada },
            });

            const resposta = await request(app)
                .post('/auth/login')
                .send({ email: 'login@sucesso.com', senha: 'senhaDoSucesso123#' });

            expect(resposta.status).toBe(200);
            expect(resposta.body).toHaveProperty('token')
        });
    });

    describe('GET /usuarios', () => {
        it('deve retornar uma lista de usuarios cadastrados', async () => {
            await prisma.usuario.deleteMany();
            const senhaHash1 = await bcrypt.hash('user1User#', 10);
            const senhaHash2 = await bcrypt.hash('user2User#', 10);
            await prisma.usuario.createMany({
                data: [
                    { nome: 'user 1', email: 'user1@email.com', senha: senhaHash1 },
                    { nome: 'user 2', email: 'user2@email.com', senha: senhaHash2 }
                ]
            });

            const resposta = await request(app)
                .get('/usuarios')

            expect(resposta.status).toBe(200);
            expect(resposta.body.length).toBe(2);
        });
    });


})