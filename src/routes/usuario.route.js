import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.post('/auth/cadastro', (req, res) => usuarioController.cadastrar(req, res));
usuarioRouter.post('/auth/login', (req, res) => usuarioController.login(req, res));
usuarioRouter.get('/usuarios', (req, res) => usuarioController.listar(req, res));
usuarioRouter.delete('/usuarios/:id', (req, res) => usuarioController.deletar(req, res));

export default usuarioRouter;