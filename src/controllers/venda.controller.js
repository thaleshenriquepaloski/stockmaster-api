import VendaService from "../services/venda.service.js";

class VendaController {
    constructor() {
        this.vendaService = new VendaService();
    }

    async cadastrar(req, res) {
        try {
            const { produto_id, usuario_id, qtd_vendida } = req.body;
            const dto = { 
                produto_id: Number(produto_id),
                usuario_id: Number(usuario_id), 
                qtd_vendida: Number(qtd_vendida)
            };

            const vendaRealizada = await this.vendaService.cadastrar(dto);
            return res.status(201).json(vendaRealizada);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    };
 
    async listar(req, res) {
        try {
            const vendas = await this.vendaService.listar();
            return res.status(200).json(vendas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: error.message });
        }
    };

    async listarPorId(req, res) {
        try {
            const id = Number(req.params.id);
            const venda = await this.vendaService.listarPorId(id);
            return res.status(200).json(venda);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: error.message });
        }
    };
};

export default VendaController;