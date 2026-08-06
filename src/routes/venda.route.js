import { Router } from "express";
import VendaController from "../controllers/venda.controller.js";

const vendaRouter = Router();
const vendaController = new VendaController();

vendaRouter.post('/vendas', (req, res) => vendaController.cadastrar(req, res));
vendaRouter.get('/vendas', (req, res) => vendaController.listar(req, res));
vendaRouter.get('/vendas/:id', (req, res) => vendaController.listarPorId(req, res));

export default vendaRouter;