import prisma from "../database/prisma.js";

class ProdutoService {
    
    async cadastrar(dto) {
        const { nome, preco } = dto
        if(!nome || !preco) {
            const error = new Error("Nome e preço são obrigatórios no cadastro de um produto.");
            error.statusCode = 400;
            throw error;
        }

        const produtoExistente = await prisma.produto.findFirst({
            where: { nome }
        })
        if(produtoExistente) {
            const error = new Error(`Este nome de produto já está cadastrado. Você pode atualizar usando "/produtos/${produtoExistente.id}"`);
            error.statusCode = 400;
            throw error;
        }

        return await prisma.produto.create({
            data: { ...dto }
        });
    };

    async listar() {
        return await prisma.produto.findMany();
    };

    async listarPorId(id) {
        const produto = await prisma.produto.findUnique({
            where: { id }
        })
        if(!produto) {
            const error = new Error("Produto não foi encontrado. Verifique o ID e tente novamente.")
            error.statusCode = 404;
            throw error;
        }
        return produto;
    };

    async atualizar(id, dto) {

        const produtoExistente = await prisma.produto.findUnique({
            where: { id }
        })
        if(!produtoExistente) {
            const error = new Error("O produto que você deseja atualizar não foi encontrado em nosso banco de dados. Verifique o ID e tente novamente.")
            error.statusCode = 404
            throw error;
        }

        return await prisma.produto.update({
            where: { id },
            data: { ...dto }
        });
    };

    async deletar(id) {
        const produtoExistente = await prisma.produto.findUnique({
            where: { id }
        })
        if(!produtoExistente) {
            const error = new Error("O produto que você deseja deletar não foi encontrado em nosso banco de dados. Verifique o ID e tente novamente.")
            error.statusCode = 404;
            throw error;
        }

        await prisma.produto.delete({
            where: { id }
        })
        return { mensagem: "Produto deletado com sucesso!" };
    };
};

export default ProdutoService;