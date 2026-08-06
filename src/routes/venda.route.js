import { Router } from "express";
import VendaController from "../controllers/venda.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const vendaRouter = Router();
const vendaController = new VendaController();

vendaRouter.get('/vendas', authMiddleware, (req, res) => vendaController.listar(req, res));
vendaRouter.get('/vendas/:id', authMiddleware, (req, res) => vendaController.listarPorId(req, res));
vendaRouter.post('/vendas', authMiddleware, (req, res) => vendaController.cadastrar(req, res));

export default vendaRouter;