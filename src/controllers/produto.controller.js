import ProdutoService from "../services/produto.service.js";

class ProdutoController {
    constructor() {
        this.produtoService = new ProdutoService();
    }

    async cadastrar(req, res) {
        try {
            const { nome, descricao, preco, qtd_estoque } = req.body;
            const dto = { nome, descricao, preco, qtd_estoque } 
            const produto = await this.produtoService.cadastrar(dto);
            return res.status(201).json(produto);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ erro: error.message });
        }
    };

    async listar(req, res) {
        try {
            const produtos = await this.produtoService.listar();
            return res.status(200).json(produtos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: error.message });
        }
    };

    async listarPorId(req, res) {
        try {
            const id = Number(req.params.id);
            const produto = await this.produtoService.listarPorId(id);
            return res.status(200).json(produto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: error.message });
        }
    };

    async atualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const { nome, descricao, preco, qtd_estoque } = req.body;
            const dto = { nome, descricao, preco, qtd_estoque };
            const produtoAtualizado = await this.produtoService.atualizar(id, dto);
            return res.status(200).json(produtoAtualizado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: error.message });
        }
    };

    async deletar(req, res) {
        try {
            const id = Number(req.params.id);
            const retornoDeDelecao = await this.produtoService.deletar(id);
            return res.status(200).json(retornoDeDelecao);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: error.message });            
        }
    };
};

export default ProdutoController;