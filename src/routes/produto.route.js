import { Router } from "express";
import ProdutoController from "../controllers/produto.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorAtualizarProduto, validadorCadastroProduto } from "../validators/produto.validator.js";

const produtoRouter = Router();
const produtoController = new ProdutoController();

// 1. Lista todos os produtos (rota pública)
produtoRouter.get('/produtos', (req, res, next) => {
    /*
      #swagger.tags = ['Produtos']
      #swagger.summary = 'Lista todos os produtos cadastrados'
      #swagger.responses[200] = { description: 'List de produtos retornada com sucesso.' } 
    */
    produtoController.listar(req, res, next)
});

// 2. Busca produto por ID (Path Parameter)
produtoRouter.get('/produtos/:id', (req, res, next) => {
    /*
      #swagger.tags = ['Produtos']
      #swagger.summary = 'Busca um produto específico pelo ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID do produto a ser pesquisado',
        required: 'true',
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = { description: 'Produto encontrado.' }
      #swagger.responses[404] = { description: 'Produto não encontrado.' }
    */
    produtoController.listarPorId(req, res, next)
});

// 3. Cadastra Produto (Rota Protegida + Path Param + Body)
produtoRouter.post('/produtos', authMiddleware, validator(validadorCadastroProduto), (req, res, next) => {
    /* 
      #swagger.tags = ['Produtos']
      #swagger.summary = 'Cadastra um novo produto no estoque'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              nome: "Teclado Mecânico",
              descricao: 'Teclado mecanico gamer bluetooth',
              preco: 350.00,
              qtd_estoque: 100
          }
      }
      #swagger.responses[201] = { description: 'Produto cadastrado com sucesso.' }
      #swagger.responses[400] = { description: 'Erro de validação nos dados enviados.' }
      #swagger.responses[401] = { description: 'Token de autenticação ausente ou inválido.' }
    */
    produtoController.cadastrar(req, res, next)
});

// 4. Atualiza um Produto pelo ID (rota protegida + path param + body)
produtoRouter.put('/produtos/:id', authMiddleware, validator(validadorAtualizarProduto), (req, res, next) => {
    /* 
      #swagger.tags = ['Produtos']
      #swagger.summary = 'Atuliza os dados de um produto existente'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID do produto a ser atualizado',
        required: true,
        type: 'integer',
        example: 1
      }
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            nome: "Teclado Mecânico RGB",
            descricao: "Nova funcionalidade"
            preco: 280.00,
            qtd_estoque: 20
          }
      }
    */
    produtoController.atualizar(req, res, next)
});

// 5. Deletar um produto (Rota protegida + path param)
produtoRouter.delete('/produtos/:id', authMiddleware, (req, res, next) => {
    /* 
      #swagger.tags = ['Produtos']
      #swagger.summary = 'Remove um produto do estoque'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID do produto a ser deletado',
          required: true,
          type: 'integer',
          example: 1
      }
      #swagger.responses[204] = { description: 'Produto deletado com sucesso. (Sem conteúdo no retorno)' }
      #swagger.responses[401] = { description: 'Não autorizado. Token ausente ou inválido.' }
      #swagger.responses[404] = { description: 'Produto não encontrado.' }
    */
    produtoController.deletar(req, res, next)
});

export default produtoRouter;