const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: `${paramName} no es válido`
            });
        }

        next();
    };
};

const validaExisteMiddleware = (Modelo, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const id = req.params[paramName];
            const registro = await Modelo.findById(id);
            if (!registro) {
                return res.status(404).json({
                    message: `El id ${id} no existe en ${Modelo.modelName}`
                });
            }
            req.registro = registro;
            next();
        } catch (error) {
            return res.status(500).json({
                message: 'Error validando existencia',
                error: error.message
            });
        }
    };
};

module.exports = {
    validateObjectId,
    validaExisteMiddleware
};