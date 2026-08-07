import VendaService from "../services/venda.service.js";

class VendaController {
    constructor() {
        this.vendaService = new VendaService();
    }

    cadastrar = async (req, res, next) => {
        try {
            const { produto_id, qtd_vendida } = req.body;
            const dto = { 
                produto_id: Number(produto_id),
                usuario_id: req.usuarioLogado?.id ? Number(req.usuarioLogado.id) : undefined, 
                qtd_vendida: Number(qtd_vendida)
            };

            const vendaRealizada = await this.vendaService.cadastrar(dto);
            return res.status(201).json(vendaRealizada);
        } catch (error) {
            next(error);
        }
    };
 
    listar = async (req, res, next) => {
        try {
            const vendas = await this.vendaService.listar();
            return res.status(200).json(vendas);
        } catch (error) {
            next(error);
        }
    };

    listarPorId = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const venda = await this.vendaService.listarPorId(id);
            return res.status(200).json(venda);
        } catch (error) {
            next(error);
        }
    };
};

export default VendaController;