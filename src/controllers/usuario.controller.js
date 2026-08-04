import UsuarioService from "../services/usuario.service.js";

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();
    }

    async cadastrar(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const usuario = await this.usuarioService.cadastrar(nome, email, senha);
            return res.status(201).json(usuario);
        } catch (error) {
            console.error(error)
            return res.status(400).json({ erro: error.message });
        }
    };

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const resultado = await this.usuarioService.login(email, senha);
            return res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            return res.status(401).json({ erro: error.message });
        }
    };

    async listar(req, res) {
        try {
            const usuarios = await this.usuarioService.listar();
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    };
    
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await this.usuarioService.deletar(id);
            return res.status(200).json(resultado); 
        } catch (error) {
            console.error(error);
            return res.status(404).json({ erro: error.message });
        }
    };
};

export default UsuarioController;