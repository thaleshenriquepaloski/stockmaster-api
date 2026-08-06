import prisma from "../database/prisma.js";

class VendaService {

    async cadastrar(dto) {
        const { produto_id, usuario_id, qtd_vendida } = dto;

        if(qtd_vendida <= 0) {
            throw new Error("Deve ser inserido no mínimo uma unidade para venda")
        };

        const produtoExistente = await prisma.produto.findUnique({
            where: { id: produto_id }
        })
        if(!produtoExistente) {
            throw new Error("Produto não encontrado.");
        };

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id: usuario_id }
        })
        if(!usuarioExistente) {
            throw new Error("Usuário não encontrado.")
        }

        if(produtoExistente.qtd_estoque < qtd_vendida) {
            throw new Error(`Estoque insuficiente. Unidades disponíveis: ${produtoExistente.qtd_estoque}`)
        };

        const valor_total = Number(produtoExistente.preco * qtd_vendida);


        const [ vendaCriada ] = await prisma.$transaction([
            //Operação A: cria a venda na tabela Vendas
            prisma.venda.create({
                data: {
                    produto_id, 
                    usuario_id, 
                    qtd_vendida, 
                    valor_total
                }
            }),
            //Operação B: Decrementa qtd_estoque na tabela Produto
            prisma.produto.update({
                where: { id: produto_id },
                data: {
                    qtd_estoque: produtoExistente.qtd_estoque - qtd_vendida
                }
            })
        ]);

        return vendaCriada;
    };

    async listar() {
        return await prisma.venda.findMany();
    };

    async listarPorId(id) {
        const venda = await prisma.venda.findUnique({
            where: { id }
        })
        if(!venda) {
            throw new Error("Venda não encontrada.")
        }

        return venda;
    }

}

export default VendaService;