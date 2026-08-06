import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.post('/auth/cadastro', usuarioController.cadastrar);
usuarioRouter.post('/auth/login', usuarioController.login);
usuarioRouter.get('/usuarios', usuarioController.listar);
usuarioRouter.delete('/usuarios/:id', usuarioController.deletar);

export default usuarioRouter;