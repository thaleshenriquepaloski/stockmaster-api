import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: 'StockMaster API',
        description: 'API RESTful para gerenciamento de estoque, produtos, usuários e vendas',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Insira um Token JWT no formato: Bearer <seu_token>'
        }
    }
};

const outputFile = './src/docs/swagger-output.json';
const routesEndPointsFiles = [
    './src/app.js',
    './src/routes/usuario.route.js'
];

swaggerAutogen()(outputFile, routesEndPointsFiles, doc);