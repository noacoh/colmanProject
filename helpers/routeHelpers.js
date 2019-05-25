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
        userSchema: joi.object().keys({
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            identityNumber: joi.string().regex(/^[0-9]{9}$/).required(),
            password: joi.string().required()
        }),
        userOptionalSchema:joi.object().keys({
            firstName: joi.string(),
            lastName: joi.string(),
            identityNumber: joi.string().regex(/^[0-9]{9}$/),
            password: joi.string()
        }),
        courseSchema: joi.object().keys({
            title: joi.string().required(),
            year: joi.number().required()
        }),
        courseOptionalSchema: joi.object().keys({
            title: joi.string(),
            year: joi.number()
        }),
        taskSchema: joi.object().keys({
            title: joi.string().required(),
            filePath: joi.string().required(),
            solutionPath: joi.string().required(),
            created: joi.date().required(),
            deadline: joi.date().required()
        }),
        submissionSchema: joi.object().keys({
            submissionDate: joi.string().required(),
            grade: joi.number().required(),
            filePath: joi.string().required(),

        }),
        taskOptionalSchema: joi.object().keys({
            title: joi.string(),
            filePath: joi.string(),
            solutionPath: joi.string(),
            created: joi.date(),
            deadline: joi.date()
        })
        }),
        authenticationSchema: joi.object.keys({
            identityNumber: joi.string().regex(/^[0-9]{9}$/).required(),
            password: joi.string().required()
        }),
    }
};
