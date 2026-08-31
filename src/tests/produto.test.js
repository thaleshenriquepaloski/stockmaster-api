import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../database/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

describe('Teste de Integração - Produto', () => {

    beforeEach(async () => {
        await prisma.venda.deleteMany();
        await prisma.produto.deleteMany();
        await prisma.usuario.deleteMany();
    });

    //helper function
    const criarUsuarioTeste = async () => {
        const senhaHash = await bcrypt.hash('senhaTeste123%', 10);
        const usuario = await prisma.usuario.create({
            data: { nome: 'User', email: `user_${crypto.randomUUID}@teste.com` , senha: senhaHash }
        });
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'chave_secreta_apenas_para_testes');
        return [usuario, token];
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

    describe('POST /produtos', () => {
        it('deve retornar um erro 401 caso o nao seja recebido token de autenticação', async () => {
            const novoProduto = { nome: 'produto-teste', descricao: 'descricao', preco: 230, qtd_estoque: 10 };
            
            const resposta = await request(app)
                .post('/produtos')
                .send(novoProduto);

            expect(resposta.status).toBe(401);
            expect(resposta.body.erro).toMatch(/^Token não fornecido!$/);
        });

        it('deve lançar um erro 400 caso preco ou nome não sejam inseridos (validação ZOD)', async() => {
            const [, token ] = await criarUsuarioTeste();
            const novoProduto = { descricao: 'teste', preco: -10, qtd_estoque: 10 };
            
            const resposta = await request(app)
                .post('/produtos')
                .set('Authorization', `Bearer ${token}`)
                .send(novoProduto);

            expect(resposta.status).toBe(400);
            expect(resposta.body.mensagem).toMatch(/^Dados inválidos enviados na requisição$/);
        });

        it('deve lançar um erro 400 ao tentar criar um produto já existente', async () => {
            const [, token] = await criarUsuarioTeste();
            await prisma.produto.create({ data: { nome: 'existente', preco: 10, qtd_estoque: 10 } });

            const resposta = await request(app)
                .post('/produtos')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'existente', preco: 10, qtd_estoque: 10 });
            
            expect(resposta.status).toBe(400);
            expect(resposta.body.erro).toMatch(/^Este nome de produto já está cadastrado.$/);
        });

        it('deve lançar um erro 400 ao tentar criar um produto com qtd_estoque negativa (validação ZOD)', async () => {
            const [, token] = await criarUsuarioTeste();
            
            const resposta = await request(app)
                .post('/produtos')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'quatidade', preco: 10, qtd_estoque: -1 });

            expect(resposta.status).toBe(400);
            expect(resposta.body.mensagem).toMatch(/^Dados inválidos enviados na requisição$/);
            expect(resposta.body.erros[0].mensagem).toMatch(/^A quantidade precisa ser positiva.$/)
        });

        it('deve cadastrar um novo produto corretamente', async () => {
            const [, token] = await criarUsuarioTeste();
            const novoProduto = { nome: 'produto novo', descricao: 'descricao teste', preco: 2200, qtd_estoque: 10 };

            const resposta = await request(app)
                .post('/produtos')
                .set('Authorization', `Bearer ${token}`)
                .send(novoProduto);
            
            expect(resposta.status).toBe(201);
            expect(resposta.body).toHaveProperty('id');
        });
    });

    describe('PUT /produtos/:id', () => {
        it('deve lançar um erro 401 não autorizado ao atualizar um produto sem token', async () => {
            const produto = await prisma.produto.create({ data: { nome: 'unauthorized', descricao: 'qualquer', preco: 100, qtd_estoque: 200 }});
            const resposta = await request(app)
                .put(`/produtos/${produto.id}`)
                .send({ nome: 'atualizado', descricao: 'ta caro hein', preco: 50 });
            
            expect(resposta.status).toBe(401);
            expect(resposta.body.erro).toMatch(/^Token não fornecido!$/)
        });

        it('deve lançar um erro 404 not found caso o produto não seja encontrado', async () => {
            const [, token] = await criarUsuarioTeste();
            
            const resposta = await request(app)
                .put(`/produtos/1`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Atualizado', preco: 20, qtd_estoque: 10 });

            expect(resposta.status).toBe(404);
            expect(resposta.body.erro).toMatch('O produto que você deseja atualizar não foi encontrado em nosso banco de dados. Verifique o ID e tente novamente.')
        });

        it('deve lançar um erro 400 caso o preço não seja inserido incorretamente', async () => {
            const [, token] = await criarUsuarioTeste();
            const produto = await prisma.produto.create({ data: { nome: 'atualizar', descricao: 'atu', preco: 10, qtd_estoque: 20 } });
            
            const resposta = await request(app)
                .put(`/produtos/${produto.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'atualizado', descricao: 'atualizarei', preco: -20, qtd_estoque: 30 });
            
            expect(resposta.status).toBe(400);
            expect(resposta.body.erros[0].mensagem).toMatch(/^O preço precisa ser um valor positivo.$/)
        });

        it('deve lançar um status 200 e atualizar um produto', async () => {
            const [, token] = await criarUsuarioTeste();
            const produto = await prisma.produto.create({ data: { nome: 'vai atualizar', descricao: 'vai dar certo', preco: 200, qtd_estoque: 3000 } });

            const resposta = await request(app)
                .put(`/produtos/${produto.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ preco: 2402 });

            expect(resposta.status).toBe(200);
            expect(resposta.body.preco).toBe(2402);
        });
    });

    describe('DELETE /produtos/:id', () => {
        it('deve lançar um erro 401 não autorizado por falta de token', async () => {
            const produto = await prisma.produto.create({ data: { nome: 'deletar', preco: 200, qtd_estoque: 1 }});
            
            const resposta = await request(app)
                .delete(`/produtos/${produto.id}`)
                .send({ preco: 400 });
            
            expect(resposta.status).toBe(401);
            expect(resposta.body.erro).toMatch(/^Token não fornecido!$/);
        });

        it('deve lançar um erro 404 not found de produto não encontrado', async () => {
            const [, token] = await criarUsuarioTeste();
            const resposta = await request(app)
                .delete('/produtos/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ qtd_estoque: 200 });
            
            expect(resposta.status).toBe(404);
            expect(resposta.body.erro).toMatch(/^O produto que você deseja deletar não foi encontrado em nosso banco de dados. Verifique o ID e tente novamente.$/)
        });

        it('deve lançar status ok e deletar um produto corretamente', async () => {
            const [, token] = await criarUsuarioTeste();
            const produto = await prisma.produto.create({ data: { nome: 'A deletar', preco: 200, qtd_estoque: 20 }});
            
            const resposta = await request(app)
                .delete(`/produtos/${produto.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).toBe(200);
            expect(resposta.body.mensagem).toMatch(/^Produto deletado com sucesso!$/)
        });
    });
});