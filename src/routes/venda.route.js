import { Router } from "express";
import VendaController from "../controllers/venda.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorCadastroVenda } from "../validators/venda.validator.js";

const vendaRouter = Router();
const vendaController = new VendaController();

// 1. Lista todas as vendas (Protegida)
vendaRouter.get('/vendas', authMiddleware, (req, res, next) => {
    /*
      #swagger.tags = ['Vendas']
      #swagger.summary = 'Lista todas as vendas realizadas'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = { description: 'Lista de vendas retornada com sucesso.' }
      #swagger.responses[401] = { description: 'Não autorizado. Token ausente ou inválido.' }
    */
    vendaController.listar(req, res, next);
});

// 2. Lista uma venda por ID (Protegida)
vendaRouter.get('/vendas/:id', authMiddleware, (req, res, next) => {
    /* 
      #swagger.tags = ['Vendas']
      #swagger.summary = 'Busca detalhes de uma venda pelo ID'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID da venda',
          required: true,
          type: 'integer',
          example: 1
      }
      #swagger.responses[200] = { description: 'Venda encontrada.' }
      #swagger.responses[401] = { description: 'Não autorizado. Token ausente ou inválido.' }
      #swagger.responses[404] = { description: 'Venda não encontrada.' }
    */
    vendaController.listarPorId(req, res, next);
});

// 3. Cadastra uma nova venda (Protegida + body)
vendaRouter.post('/vendas', authMiddleware, validator(validadorCadastroVenda), (req, res, next) => {
    /*
      #swagger.tags = ['Vendas']
      #swagger.summary = 'Registra uma nova venda'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            produto_id: 1,
            qtd_vendida: 2
        }
      }
      #swagger.responses[201] = { description: 'Venda registrada com sucesso.' }
      #swagger.responses[400] = { description: 'Erro de validação ou estoque insuficiente.' }
      #swagger.responses[401] = { description: 'Não autorizado. Token ausente ou inválido.' }
    */
    vendaController.cadastrar(req, res, next);
});

export default vendaRouter;