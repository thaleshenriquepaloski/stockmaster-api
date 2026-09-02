import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorCadastroUsuario, validadorLoginUsuario } from "../validators/usuario.validator.js";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.post('/auth/cadastro', validator(validadorCadastroUsuario), (req, res, next) => {
    /* 
      #swagger.tags = ['Autenticação']
      #swagger.summary = 'Cadastra um novo usuário'
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              nome: "Thales",
              email: "thales@email.com",
              senha: "Senha123segura$"
          }
      }
      #swagger.responses[201] = { description: 'Usuário cadastrado com sucesso.' }
      #swagger.responses[400] = { description: 'Erro de validação nos dados enviados.' }
    */    
    usuarioController.cadastrar(req, res, next);
});
usuarioRouter.post('/auth/login', validator(validadorLoginUsuario), (req, res, next) => {
    /* 
    #swagger.tags = ['Autenticação']
    #swagger.summary = 'Autentica um usuário e retorna um token JWT'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Credenciais de acesso',
      required: true,
      schema: {
        email: "thales@email.com",
        senha: "Senha123segura$"
      }
    }
  */
    usuarioController.login(req, res, next);
});
usuarioRouter.get('/usuarios', usuarioController.listar);
usuarioRouter.delete('/usuarios/:id', usuarioController.deletar);

export default usuarioRouter;