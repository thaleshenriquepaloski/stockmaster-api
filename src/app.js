import express from "express";
import usuarioRouter from "./routes/usuario.route.js";
import produtoRouter from "./routes/produto.route.js";

const app = express();

app.use(express.json());
app.use(usuarioRouter);
app.use(produtoRouter);

app.get('/', (req, res) => {
    return res.status(200).json({ mensagem: "API StockMaster rodando com sucesso!" });
});

export default app;