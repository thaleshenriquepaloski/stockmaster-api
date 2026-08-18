import { describe, it, expect, vi, beforeEach } from "vitest";
import VendaService from "./venda.service.js";
import prisma from "../database/prisma.js";

vi.mock('../database/prisma.js', () => ({
    default: {
        venda: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
        produto: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        usuario: {
            findUnique: vi.fn(),
        },
        $transaction: vi.fn(),
    }
}));

describe('VendaService - Testes unitários', () => {
    let vendaService;

    beforeEach(() => {
        vendaService = new VendaService();
        vi.clearAllMocks();
    });

    describe('cadastrar()', () => {
        it('deve lançar um erro 400 se caso a quantidade de venda for <= 0', async () => {
            const dto = { produto_id: 1, usuario_id: 1, qtd_vendida: 0 };

            await expect(vendaService.cadastrar(dto)).rejects.toThrow(/^Deve ser inserido no mínimo uma unidade para venda$/);

            expect(prisma.produto.findUnique).not.toHaveBeenCalled();
            expect(prisma.usuario.findUnique).not.toHaveBeenCalled();
        });

        it('deve lançar um erro 400 caso o ID seja inserido incorretamente', async () => {
            const dto = { produto_id: '1', usuario_id: 1, qtd_vendida: 3 };

            await expect(vendaService.cadastrar(dto)).rejects.toThrow(/^Insira o ID do produto corretamente!$/);
            expect(prisma.produto.findUnique).not.toHaveBeenCalled();
        });

        it('deve lançar um erro 400 caso a unidade de quantidade vendida seja inválida', async () => {
            const dto = { produto_id: 1, usuario_id: 1, qtd_vendida: 's' };

            await expect(vendaService.cadastrar(dto)).rejects.toThrow(/^Deve ser inserido no mínimo uma unidade válida para venda!$/);
            expect(prisma.produto.findUnique).not.toHaveBeenCalled();
        });

        it('deve lançar um erro 404 caso o produto não seja encontrado', async () => {
            prisma.produto.findUnique.mockResolvedValue(null);

            const dto = { produto_id: 2, usuario_id: 1, qtd_vendida: 10 };

            await expect(vendaService.cadastrar(dto)).rejects.toThrow(/^Produto não encontrado.$/);
            expect(prisma.produto.findUnique).toHaveBeenCalledWith({ where: { id: 2 }});
        });

        it('deve lançar um erro 404 caso o usuario não seja encontrado', async () => {
            prisma.produto.findUnique.mockResolvedValue({ id: 1, nome: 'teste', descricao: 'teste', preco: 123, qtd_estoque: 10, criadoEm: new Date() });
            prisma.usuario.findUnique.mockResolvedValue(null);

            const dto = { produto_id: 1, usuario_id: 99, qtd_vendida: 3 };

            await expect(vendaService.cadastrar(dto)).rejects.toThrow(/^Usuário não encontrado.$/);
            expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { id: 99 }});
        });

        it('deve lançar um erro 400 caso o estoque seja insuficiente', async () => {
            prisma.produto.findUnique.mockResolvedValue({ id: 1, nome: 'Estoque', preco: 23, qtd_estoque: 10, criadoEm: new Date() });
            prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'User Teste', email: 'teste@teste.com' });
            const dto = { produto_id: 1, usuario_id: 1, qtd_vendida: 11 };

            await expect(vendaService.cadastrar(dto)).rejects.toThrow(/^Estoque insuficiente. Unidades disponíveis: 10$/);
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('deve calcular venda_total corretamente e salvar uma venda', async () => {
            const precoUnitario = 150.35;
            const qtdVendida = 3;
            const valorTotalEsperado = 451.05;

            const dto = { produto_id: 1, usuario_id: 1, qtd_vendida: qtdVendida };

            prisma.produto.findUnique.mockResolvedValue({ id: 1, nome: 'teste', preco: precoUnitario, qtd_estoque: 3 });
            prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'teste user', email: 'teste@teste.com' });

            const vendaMock = { id: 1, ...dto, valor_total: valorTotalEsperado };
            prisma.$transaction.mockResolvedValue([vendaMock]);

            const resultado = await vendaService.cadastrar(dto);

            expect(resultado).toEqual(vendaMock);
            expect(resultado.valor_total).toBe(valorTotalEsperado);
            expect(prisma.$transaction).toHaveBeenCalled();
        });
    });

    describe('listar()', () => {
        it('deve listar as vendas realizadas', async () => {
            const vendasMock = [
                { id: 1, produto_id: 1, usuario_id: 1, qtd_vendida: 2, valor_total: 50, data_venda: new Date() },
                { id: 2, produto_id: 2, usuario_id: 2, qtd_vendida: 3, valor_total: 75, data_venda: new Date() },
            ];
            prisma.venda.findMany.mockResolvedValue(vendasMock);

            const resultado = await vendaService.listar();

            expect(resultado).toEqual(vendasMock);
            expect(prisma.venda.findMany).toHaveBeenCalled();
        });
    });

    describe('listarPorId()', () => {
        it('deve lançar um erro 400 caso o tipo de ID não seja um número válido', async () => {
            await expect(vendaService.listarPorId('1')).rejects.toThrow(/^Tipo de ID da venda não reconhecido!$/);
            expect(prisma.venda.findUnique).not.toHaveBeenCalled();
        });

        it('deve lançar um erro 404 caso o ID da venda não seja encontrado', async () => {
            prisma.venda.findUnique.mockResolvedValue(null);

            await expect(vendaService.listarPorId(2)).rejects.toThrow(/^Venda não encontrada.$/);
            expect(prisma.venda.findUnique).toHaveBeenCalledWith({ where: { id: 2 }});
        });

        it('deve listar uma venda pelo ID fornecido', async () => {
            const vendaMock = { id: 1, produto_id: 1, usuario_id: 1, qtd_vendida: 2, valor_total: 50 }
            prisma.venda.findUnique.mockResolvedValue(vendaMock);

            const resultado = await vendaService.listarPorId(1)

            expect(resultado).toEqual(vendaMock);
            expect(prisma.venda.findUnique).toHaveBeenCalledWith({ where: { id: 1 }});
        });
    });
});

