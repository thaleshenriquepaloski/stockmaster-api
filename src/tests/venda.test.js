import { describe, it, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../app";
import prisma from "../database/prisma.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

describe('Teste de Integração - Venda', () => {

    beforeEach(async () => {
        await prisma.venda.deleteMany();
        await prisma.produto.deleteMany();
        await prisma.usuario.deleteMany();
    });

    //helper function

    const criarUsuarioQueCriaProdutos =  async () => {
        const senhaHash = await bcrypt.hash('senhaTeste123%', 10);
        const usuario = await prisma.usuario.create({
            data: { nome: 'User', email: `user${Date.now()}@teste.com` , senha: senhaHash }
        });
        const token = jwt.sign({ id: usuario.id, email: 'user@teste.com' }, process.env.JWT_SECRET || 'chave_secreta_apenas_para_testes');
        
        const produtos = await prisma.produto.createManyAndReturn({ 
            data: [
                { nome: 'mouse gamer', descricao: 'mouse test', preco: 200, qtd_estoque: 100 },
                { nome: 'teclado gamer', descricao: 'teclado test', preco: 450, qtd_estoque: 200 }
            ]
        });
        return [usuario, token, produtos];
    };

    describe('GET /vendas', () => {
        it('deve dar um erro 401 ao listar vendas caso o token não seja inserido', async () => {
            const resposta = await request(app)
                .get('/vendas');

            
            expect(resposta.status).toBe(401);
            expect(resposta.body.erro).toMatch(/^Token não fornecido!$/)
        });

        it('deve listar todas as vendas realizadas', async () => {
            const [ usuario, token, produtos ] = await criarUsuarioQueCriaProdutos();
            await prisma.venda.createMany({ data: [
                { produto_id: produtos[0].id, usuario_id: usuario.id, qtd_vendida: 5, valor_total: 200 },
                { produto_id: produtos[1].id, usuario_id: usuario.id, qtd_vendida: 2, valor_total: 80 }
            ]});

            const resposta = await request(app)
                .get('/vendas')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).toBe(200);
            expect(resposta.body.length).toEqual(2);
        });
    });

    describe('GET /vendas/:id', () => {
        it('deve lançar um erro 401 ao tentar listar uma venda pelo id sem o token', async () => {
            const resposta = await request(app)
                .get('/vendas/1');
            
            expect(resposta.status).toBe(401);
            expect(resposta.body.erro).toMatch(/^Token não fornecido!$/);
        });

        it('deve lançar um erro 400 caso id de uma venda não seja reconhecido', async () => {
            const [, token, ] = await criarUsuarioQueCriaProdutos();
            const resposta = await request(app)
                .get('/vendas/t')
                .set('Authorization', `Bearer ${token}`);
            
            expect(resposta.status).toBe(400);
            expect(resposta.body.erro).toMatch(/^Tipo de ID da venda não reconhecido!$/)
        });

        it('deve lançar um erro 404 caso a venda não seja encontrada pelo id fornecido', async () => {
            const [, token, ] = await criarUsuarioQueCriaProdutos();
            const resposta = await request(app)
                .get('/vendas/1')
                .set('Authorization', `Bearer ${token}`);
            
            expect(resposta.status).toBe(404);
            expect(resposta.body.erro).toMatch(/^Venda não encontrada.$/)
        });

        it('deve listar a venda pelo id fornecido', async () => {
            const [ usuario, token, produtos ] = await criarUsuarioQueCriaProdutos();
            const venda = await prisma.venda.create({ 
                data: { produto_id: produtos[0].id, usuario_id: usuario.id, qtd_vendida: 2, valor_total: 20 }
            });

            const resposta = await request(app)
                .get(`/vendas/${venda.id}`)
                .set('Authorization', `Bearer ${token}`)
            
            expect(resposta.status).toBe(200);
            expect(resposta.body).toHaveProperty('id', venda.id);
            expect(resposta.body.produto_id).toBe(produtos[0].id);
            expect(resposta.body.usuario_id).toBe(usuario.id);
            expect(resposta.body.qtd_vendida).toBe(2);
            expect(resposta.body.valor_total).toBe(20);
        });
    });
});