import prisma from "../database/prisma.js";
import redisClient from "../configs/redis.js";

class ProdutoService {
    
    async cadastrar(dto) {
        const { nome, preco, qtd_estoque } = dto
        if(!nome || !preco) {
            const error = new Error("Nome e preço são obrigatórios no cadastro de um produto.");
            error.statusCode = 400;
            throw error;
        }

        const produtoExistente = await prisma.produto.findFirst({
            where: { nome }
        })
        if(produtoExistente) {
            const error = new Error(`Este nome de produto já está cadastrado.`);
            error.statusCode = 400;
            throw error;
        }

        if(typeof preco !== 'number' || isNaN(preco) || preco <= 0) {
            const error = new Error("Insira um preço válido e adequado ao produto!")
            error.statusCode = 400;
            throw error;
        }

        if(typeof qtd_estoque !== 'number' || isNaN(qtd_estoque) || qtd_estoque <= 0) {
            const error = new Error("Quantidade de estoque deve ser um valor válido!");
            error.statusCode = 400;
            throw error;
        }

        const novoProduto = await prisma.produto.create({
            data: { ...dto }
        });

        await redisClient.del('produtos:todos');

        return novoProduto;
    };

    async listar() {
        const CACHE_KEY = 'produtos:todos';
        
        const produtosCache = await redisClient.get(CACHE_KEY);
        if(produtosCache) {
            return JSON.parse(produtosCache);
        };

        const produtos = await prisma.produto.findMany();
        if(produtos.length > 0) {
            await redisClient.set(CACHE_KEY, JSON.stringify(produtos), { EX: 60 });
        }

        return produtos;
    };

    async listarPorId(id) {

        const CACHE_KEY = `produtos:${id}`;

        const produtoCache = await redisClient.get(CACHE_KEY);
        if(produtoCache) {
            return JSON.parse(produtoCache)
        }

        const produto = await prisma.produto.findUnique({
            where: { id }
        })
        if(!produto) {
            const error = new Error("Produto não foi encontrado. Verifique o ID e tente novamente.")
            error.statusCode = 404;
            throw error;
        }

        await redisClient.set(CACHE_KEY, JSON.stringify(produto), { EX: 60 });

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
        
        if(dto.preco !== undefined) {
            if(typeof dto.preco !== 'number' || isNaN(dto.preco) || dto.preco <= 0) {
                const error = new Error("O preço precisa ser um número válido!");
                error.statusCode = 400;
                throw error;
            }
        }

        const produtoAtualizado = await prisma.produto.update({
            where: { id },
            data: { ...dto }
        });

        await redisClient.del('produtos:todos');
        await redisClient.del(`produtos:${id}`);

        return produtoAtualizado;
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
        });

        await redisClient.del('produtos:todos');
        await redisClient.del(`produtos:${id}`);
        
        return { mensagem: "Produto deletado com sucesso!" };
    };
};

export default ProdutoService;