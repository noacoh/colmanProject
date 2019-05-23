const joi = require('joi');

module.exports = {
    validateParam: (schema, name) => {
        return (req, res, next) => {
            const result = joi.validate({param: req['params'][name]}, schema);
            if (result.error){
                res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['params']) {
                    req.value['params'] = {};
                }
                req.value['params'] = result.value.param;
                next();
            }
        }
    },
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            if (result.error){
                res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['body']) {
                    req.value['body'] = {};
                }
                req.value['body'] = result.value;
                next();
            }
        }
    },
    schemas: {
        idSchema: joi.object().keys({
            param: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        userSchema: joi.object.keys({
            firstName: joi.string().required(),
            lastName: joi.string().required()
        }),
        userOptionalSchema:joi.object.keys({
            firstName: joi.string(),
            lastName: joi.string()
        }),
        courseSchema: joi.object.keys({
            title: joi.string().required(),
            year: joi.number().required()
        }),
        courseOptionalSchema: joi.object.keys({
            title: joi.string(),
            year: joi.number()
        })
    }
};
