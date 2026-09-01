import UsuarioService from "../services/usuario.service.js";

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();
    }

    cadastrar = async (req, res, next) => {
        try {
            const { nome, email, senha } = req.body;
            const usuario = await this.usuarioService.cadastrar(nome, email, senha);
            return res.status(201).json(usuario);
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        /* 
        #swagger.tags = ['Autenticação']
        #swagger.summary = 'Autentica o usuário e gera o token JWT'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
            email: "thales@email.com",
            senha: "Senha123segura$"
            }
        }
        #swagger.responses[200] = { description: 'Login realizado com sucesso.' }
        #swagger.responses[401] = { description: 'Credenciais inválidas.' }
        */
        try {
            const { email, senha } = req.body;
            const resultado = await this.usuarioService.login(email, senha);
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };

    listar = async (req, res, next) => {
        try {
            const usuarios = await this.usuarioService.listar();
            return res.status(200).json(usuarios);
        } catch (error) {
            next(error);
        }
    };
    
    deletar = async (req, res, next) => {
        try {
            const { id } = req.params;
            const resultado = await this.usuarioService.deletar(id);
            return res.status(200).json(resultado); 
        } catch (error) {
            next(error);
        }
    };
};

export default UsuarioController;