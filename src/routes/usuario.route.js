import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validator from "../middlewares/validator.middleware.js";
import { validadorCadastroUsuario, validadorLoginUsuario } from "../validators/usuario.validator.js";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

// 1. Cadastro público de usuário
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

// 2. Login público de usuário
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
    #swagger.responses[200] = { description: 'Login realizado com sucesso.' }
    #swagger.responses[401] = { description: 'Credenciais inválidas.' }
  */
    usuarioController.login(req, res, next);
});

// 3. Listar usuários (protegido)
usuarioRouter.get('/usuarios', authMiddleware, (req, res, next) => {
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Lista todos os usuários do sistema'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = { description: 'Lista de usuários retornada com sucesso.' }
      #swagger.responses[401] = { description: 'Não autorizado. Token ausente ou inválido.' }
    */
    usuarioController.listar(req, res, next);
});

// 4. Deletar usuário (protegido + path param)
usuarioRouter.delete('/usuarios/:id', authMiddleware, (req, res, next) => { 
    /* 
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Remove um usuário do sistema'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID do usuário a ser deletado',
          required: true,
          type: 'integer',
          example: 1
      }
      #swagger.responses[204] = { description: 'Usuário removido com sucesso.' }
      #swagger.responses[401] = { description: 'Não autorizado.' }
      #swagger.responses[404] = { description: 'Usuário não encontrado.' }
    */
    usuarioController.deletar(req, res, next);  
});

export default usuarioRouter;