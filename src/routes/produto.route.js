import { Router } from "express";
import ProdutoController from "../controllers/produto.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorAtualizarProduto, validadorCadastroProduto } from "../validators/produto.validator.js";

const produtoRouter = Router();
const produtoController = new ProdutoController();

produtoRouter.get('/produtos', produtoController.listar);
produtoRouter.get('/produtos/:id', produtoController.listarPorId);
produtoRouter.post('/produtos', authMiddleware, validator(validadorCadastroProduto), produtoController.cadastrar);
produtoRouter.put('/produtos/:id', authMiddleware, validator(validadorAtualizarProduto), produtoController.atualizar);
produtoRouter.delete('/produtos/:id', authMiddleware, produtoController.deletar);

export default produtoRouter;