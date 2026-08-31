import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
    // 1. exibindo o log de erro no terminal (apenas para debug em desenvolvimento)
    if(process.env.NODE_ENV !== 'test') {
        console.error("Erro capturado pelo Middleware:", err.stack || err.message);
    }

    // 2. Tratamento específico: Erros de validação do Zod.
    if(err instanceof ZodError) {
        return res.status(400).json({
            status: "erro",
            mensagem: "Dados inválidos enviados na requisição",
            //mapeando o array de erros do Zod para formatar limpo: { campo: "email", mensagem: "..." }
            erros: err.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensagem: issue.message,
            }))
        });
    }

    // 2. Define o status http (se o erro já tiver status definido usa ele, senão usa 500)
    const statusCode = err.statusCode || 500;

    // 3. Retorna a resposta padronizada em JSON
    
    return res.status(statusCode).json({
        erro: err.message || "Erro interno de servidor. Tente mais tarde."
    });
};

export default errorMiddleware;