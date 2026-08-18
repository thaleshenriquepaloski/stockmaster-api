import { it, describe, expect, vi, beforeEach } from "vitest";
import ProdutoService from "./produto.service.js";
import prisma from "../database/prisma.js";

//1. simular (mockar) o arquivo Prisma

vi.mock('../database/prisma.js', () => ({
    default: {
        produto: {
            findFirst: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }
    }
}));

describe('ProdutoService - Testes Unitários', () => {
    let produtoService;
    
    beforeEach(() => {
        produtoService = new ProdutoService();
        vi.clearAllMocks();
    });

    describe('cadastrar()', () => {
        it('Deve lançar um erro 400 se o nome do produto já tiver sido cadastrado', async () => {
            const dto = { nome: 'Teclado Mecânico', preco: 250, qtd_estoque: 10 };
            prisma.produto.findFirst.mockResolvedValue({ id: 1, nome: 'Teclado Mecânico' });
            await expect(produtoService.cadastrar(dto)).rejects.toThrow(/^Este nome de produto já está cadastrado.$/);
            expect(prisma.produto.findFirst).toHaveBeenCalledWith({ where: { nome: dto.nome }});
            expect(prisma.produto.create).not.toHaveBeenCalled();
        });

        it('Deve cadastrar um produto com sucesso quando os dados forem válidos', async () => {
            const dto = { nome: 'Mouse Gamer', preco: 150, qtd_estoque: 5 };
            const produtoCriadoEsperado = { id: 2, ...dto };
            prisma.produto.findFirst.mockResolvedValue(null);
            prisma.produto.create.mockResolvedValue(produtoCriadoEsperado)
            
            const resultado = await produtoService.cadastrar(dto);
            
            expect(resultado).toEqual(produtoCriadoEsperado);
            expect(prisma.produto.create).toHaveBeenCalledWith({ data: { ...dto }});
        });
    });

    describe('listarPorId()', () => {
        it('Deve lançar um erro 404 not found caso o produto não seja encontrado', async () => {
            prisma.produto.findUnique.mockResolvedValue(null);
            
            await expect(produtoService.listarPorId(1)).rejects.toThrow(/^Produto não foi encontrado. Verifique o ID e tente novamente.$/)
        });

        it('Deve listar um produto por Id se o mesmo for válido', async () => {
            const dto = { nome: 'Apolo', preco: 30, qtd_estoque: 450 };
            const produtoMock = { id: 1, ...dto };
            prisma.produto.findUnique.mockResolvedValue(produtoMock);

            const resultado = await produtoService.listarPorId(1);

            expect(resultado).toEqual(produtoMock);
            expect(prisma.produto.findUnique).toHaveBeenCalledWith({
                where: { id: 1 }
            })
        });
    });

    describe('atualizar()', () => {
        it('deve lançar um erro 404 ao não encontrar o produto', async () => {
            const dto = {};
            prisma.produto.findUnique.mockResolvedValue(null);
            
            await expect(produtoService.atualizar(1, dto)).rejects.toThrow(/^O produto que você deseja atualizar não foi encontrado em nosso banco de dados. Verifique o ID e tente novamente.$/);
            expect(prisma.produto.findUnique).toHaveBeenCalledWith({ where: { id: 1 }});
        });

        it('deve lançar um erro 400 ao fornecer o novo preço menor ou igual a zero', async () => {
            prisma.produto.findUnique.mockResolvedValue({ id: 1, nome: 'Mouse', preco: 50 });

            await expect(produtoService.atualizar(1, { preco: -10, })).rejects.toThrow(/^O preço precisa ser um número válido!$/)
        });

        it('deve atualizar um produto', async () => {
            const produtoAntigo = { id: 1, nome: 'Teclllado', preco: 111, qtd_estoque: 299 };
            const dtoAtualizacao = { nome: 'Teclado', preco: 200, qtd_estoque: 300 };
            const produtoAtualizado = { id: 1, nome: 'Teclado', preco: 200, qtd_estoque: 300 };

            prisma.produto.findUnique.mockResolvedValue(produtoAntigo);
            prisma.produto.update.mockResolvedValue(produtoAtualizado);
            
            const resultado = await produtoService.atualizar(1, dtoAtualizacao);

            expect(resultado).toEqual(produtoAtualizado);
            expect(prisma.produto.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: dtoAtualizacao
            });
        });
    });
    describe('deletar()', () => {
        it('deve lançar um erro 404 caso não encontre o produto', async () => {
            prisma.produto.findUnique.mockResolvedValue(null);
            await expect(produtoService.deletar(1)).rejects.toThrow(/^O produto que você deseja deletar não foi encontrado em nosso banco de dados. Verifique o ID e tente novamente.$/);
        });

        it('deve deletar o produto com sucesso se o Id for válido', async () => {
            const produtoExistente = { id: 1, nome: 'Deletar', preco: 120, qtd_estoque: 10 }
            prisma.produto.findUnique.mockResolvedValue(produtoExistente);
            prisma.produto.delete.mockResolvedValue(produtoExistente);

            const resultado = await produtoService.deletar(1);

            expect(resultado).toEqual({ mensagem: 'Produto deletado com sucesso!' });
            expect(prisma.produto.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});