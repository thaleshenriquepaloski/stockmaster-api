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
    });
});

