const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'El id no es válido'
        });
    }

    next();
};

const validaExisteMiddleware = (Modelo) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
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