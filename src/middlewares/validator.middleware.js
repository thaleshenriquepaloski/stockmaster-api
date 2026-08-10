const validator = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        return next();
    } catch (error) {
        return next(error);
    }
}

export default validator;