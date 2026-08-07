import { Router } from "express";
import VendaController from "../controllers/venda.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const vendaRouter = Router();
const vendaController = new VendaController();

vendaRouter.get('/vendas', authMiddleware, vendaController.listar);
vendaRouter.get('/vendas/:id', authMiddleware, vendaController.listarPorId);
vendaRouter.post('/vendas', authMiddleware, vendaController.cadastrar);

export default vendaRouter;