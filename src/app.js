import swaggerUi from "swagger-ui-express";
import express from "express";
import usuarioRouter from "./routes/usuario.route.js";
import produtoRouter from "./routes/produto.route.js";
import vendaRouter from "./routes/venda.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import swaggerDocument from "./docs/swagger-output.json" assert { type: "json" };

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(usuarioRouter);
app.use(produtoRouter);
app.use(vendaRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    /*
      #swagger.tags = ['Geral']
      #swagger.summary = 'Verifica o status e saúde da API'
      #swagger.responses[200] = { description: 'API StockMaster rodando com sucesso!' }
    */
    return res.status(200).json({ mensagem: "API StockMaster rodando com sucesso!" });
});

export default app;