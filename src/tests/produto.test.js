import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../database/prisma.js';
import bcrypt from 'bcryptjs';

describe('Teste de Integração - Produto', () => {

    beforeEach(async () => {
        await prisma.usuario.deleteMany();
        await prisma.produto.deleteMany();
    });

    //helper function
    const criarUsuarioTeste = async () => {
        const senhaHash = bcrypt.hash('senhaTeste123%', 10);
        return await prisma.usuario.create({
            data: { nome: 'User', email: 'user@teste.com' , senha: senhaHash }
        });
    };

    describe('GET /produtos', () => {
        it('deve listar todos os produtos', async () => {
            await prisma.produto.createMany({
                data: [
                    { nome: 'Teclado', preco: 123, qtd_estoque: 10 },
                    { nome: 'Mouse', preco: 100, qtd_estoque: 12 },
                    { nome: 'CPU', preco: 300, qtd_estoque: 5 },
                ]
            });

            const resposta = await request(app)
                .get('/produtos');

            expect(resposta.status).toBe(200);
            expect(resposta.body.length).toBe(3);
        });
    });

    describe('GET /produtos/:id', () => {
        it('deve lançar um erro 404 por ID do produto não encontrado', async () => {
            await prisma.produto.create({ data: { nome: 'Mousepad', preco: 1, qtd_estoque: 3 } });
            const produto = await prisma.produto.findFirst();

            const resposta = await request(app)
                .get(`/produtos/${produto.id + 1}`);
            
            expect(resposta.status).toBe(404);
            expect(resposta.body.erro).toMatch(/^Produto não foi encontrado. Verifique o ID e tente novamente.$/)
        });
    });
});