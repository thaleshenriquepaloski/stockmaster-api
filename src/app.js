import swaggerUi from "swagger-ui-express";
import fs from "fs";
import express from "express";
import usuarioRouter from "./routes/usuario.route.js";
import produtoRouter from "./routes/produto.route.js";
import vendaRouter from "./routes/venda.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

if(fs.existsSync('./src/docs/swagger-output.json')) {
    const swaggerDocument = JSON.parse(fs.readFileSync('./src/docs/swagger-output.json', 'utf-8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

app.use(usuarioRouter);
app.use(produtoRouter);
app.use(vendaRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    return res.status(200).json({ mensagem: "API StockMaster rodando com sucesso!" });
});

export default app;