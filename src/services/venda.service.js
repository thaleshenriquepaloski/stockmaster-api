import prisma from "../database/prisma.js";

class VendaService {

    async cadastrar(dto) {
        const { produto_id, usuario_id, qtd_vendida } = dto;

        if(qtd_vendida <= 0) {
            const error = new Error("Deve ser inserido no mínimo uma unidade para venda");
            error.statusCode = 400;
            throw error;
        };

        if(typeof produto_id !== 'number' || isNaN(produto_id) || produto_id === undefined) {
            const error = new Error("Insira o ID do produto corretamente!");
            error.statusCode = 400;
            throw error;
        }
        
        if(!qtd_vendida || isNaN(qtd_vendida) || qtd_vendida <= 0) {
            const error = new Error("Deve ser inserido no mínimo uma unidade válida para venda!")
            error.statusCode = 400;
            throw error;
        }

        const produtoExistente = await prisma.produto.findUnique({
            where: { id: produto_id }
        })
        if(!produtoExistente) {
            const error = new Error("Produto não encontrado.");
            error.statusCode = 404;
            throw error;
        };

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id: usuario_id }
        })
        if(!usuarioExistente) {
            const error = new Error("Usuário não encontrado.")
            error.statusCode = 404;
            throw error;
        }

        if(produtoExistente.qtd_estoque < qtd_vendida) {
            const error = new Error(`Estoque insuficiente. Unidades disponíveis: ${produtoExistente.qtd_estoque}`)
            error.statusCode = 400;
            throw error;
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
                    qtd_estoque: {
                        decrement: qtd_vendida
                    }
                }
            })
        ]);

        return vendaCriada;
    };

    async listar() {
        return await prisma.venda.findMany();
    };

    async listarPorId(id) {
        if(typeof id !== 'number' || isNaN(id) || id === undefined) {
            const error = new Error("Tipo de ID da venda não reconhecido!");
            error.statusCode = 400;
            throw error;
        }
        
        const venda = await prisma.venda.findUnique({
            where: { id }
        })
        if(!venda) {
            const error = new Error("Venda não encontrada.")
            error.statusCode = 404;
            throw error;
        }

        return venda;
    }

}

export default VendaService;