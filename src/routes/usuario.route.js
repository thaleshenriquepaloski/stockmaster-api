import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorCadastroUsuario, validadorLoginUsuario } from "../validators/usuario.validator.js";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.post('/auth/cadastro', validator(validadorCadastroUsuario), usuarioController.cadastrar);
usuarioRouter.post('/auth/login', validator(validadorLoginUsuario), usuarioController.login);
usuarioRouter.get('/usuarios', usuarioController.listar);
usuarioRouter.delete('/usuarios/:id', usuarioController.deletar);

export default usuarioRouter;