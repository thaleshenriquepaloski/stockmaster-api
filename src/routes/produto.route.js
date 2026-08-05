import { Router } from "express";
import ProdutoController from "../controllers/produto.controller.js";

const produtoRouter = Router();
const produtoController = new ProdutoController();

produtoRouter.get('/produtos', (req, res) => produtoController.listar(req, res));
produtoRouter.get('/produtos/:id', (req, res) => produtoController.listarPorId(req, res));
produtoRouter.post('/produtos', (req, res) => produtoController.cadastrar(req, res));
produtoRouter.put('/produtos/:id', (req, res) => produtoController.atualizar(req, res));
produtoRouter.delete('/produtos/:id', (req, res) => produtoController.deletar(req, res));

export default produtoRouter;