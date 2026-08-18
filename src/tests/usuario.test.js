import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../database/prisma.js";

describe('Teste de Integração - Usuário e Auth', () => {
    beforeEach(async () => {
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
})