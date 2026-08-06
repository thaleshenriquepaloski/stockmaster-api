import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // 1. Extrai o Header Authorization;
    const authHeader = req.headers.authorization;
    // 2. Se o header não existir lança um erro de autenticação;
    if(!authHeader) {
        const error = new Error("Token não fornecido!");
        error.statusCode = 401;
        return next(error);
    }

    // 3. O formato esperado é "Bearer <TOKEN>"
    const parts = authHeader.split(" ");
    if(parts.length !== 2 || parts[0] === "Bearer") {
        const error = new Error("Formato do Token inválido!");
        error.statusCode = 401;
        return next(error);
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || "default_secret";

    try {
        // 4. Valida e decodifica o token
        const decoded = jwt.verify(token, secret);
        // 5. Injeta os dados do usuário autenticado dentro do objeto req;
        req.usuarioLogado = decoded;
        // 6. Permite que a requisição vá para o controller;
        return next();
    } catch (err) {
        const error = new Error("Token inválido ou expirado!");
        error.statusCode = 401;
        return next(error);
    }
};

export default authMiddleware;