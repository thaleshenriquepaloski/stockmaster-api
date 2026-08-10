import { Router } from "express";
import VendaController from "../controllers/venda.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorCadastroVenda } from "../validators/venda.validator.js";

const vendaRouter = Router();
const vendaController = new VendaController();

vendaRouter.get('/vendas', authMiddleware, vendaController.listar);
vendaRouter.get('/vendas/:id', authMiddleware, vendaController.listarPorId);
vendaRouter.post('/vendas', authMiddleware, validator(validadorCadastroVenda) , vendaController.cadastrar);

export default vendaRouter;