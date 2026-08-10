import ProdutoService from "../services/produto.service.js";

class ProdutoController {
    constructor() {
        this.produtoService = new ProdutoService();
    }

    cadastrar = async (req, res, next) => {
        try {
            const { nome, descricao, preco, qtd_estoque } = req.body;
            const dto = { nome, descricao, preco, qtd_estoque } 
            const produto = await this.produtoService.cadastrar(dto);
            return res.status(201).json(produto);
        } catch (error) {
            next(error);
        }
    };

    listar = async (req, res, next) => {
        try {
            const produtos = await this.produtoService.listar();
            return res.status(200).json(produtos);
        } catch (error) {
            next(error);
        }
    };

    listarPorId = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const produto = await this.produtoService.listarPorId(id);
            return res.status(200).json(produto);
        } catch (error) {
            next(error);
        }
    };

    atualizar = async (req, res,next) => {
        try {
            const id = Number(req.params.id);
            const { nome, descricao, preco, qtd_estoque } = req.body;
            const dto = { nome, descricao, preco, qtd_estoque };
            const produtoAtualizado = await this.produtoService.atualizar(id, dto);
            return res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    };

    deletar= async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const retornoDeDelecao = await this.produtoService.deletar(id);
            return res.status(200).json(retornoDeDelecao);
        } catch (error) {
            next(error);   
        }
    };
};

export default ProdutoController;