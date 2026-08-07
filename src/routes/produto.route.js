import { Router } from "express";
import ProdutoController from "../controllers/produto.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const produtoRouter = Router();
const produtoController = new ProdutoController();

produtoRouter.get('/produtos', produtoController.listar);
produtoRouter.get('/produtos/:id', produtoController.listarPorId);
produtoRouter.post('/produtos', authMiddleware, produtoController.cadastrar);
produtoRouter.put('/produtos/:id', authMiddleware, produtoController.atualizar);
produtoRouter.delete('/produtos/:id', authMiddleware, produtoController.deletar);

export default produtoRouter;