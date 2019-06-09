const joi = require('joi');
const { MODE } = require('../models/submission');
const { VISIBILITY } = require('../models/test');
const { PERMISSION } = require('../models/user');
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
            firstName: joi.string().alphanum().min(3).max(30).required(),
            lastName: joi.string().alphanum().min(3).max(30).required(),
            identityNumber: joi.string().regex(/^[0-9]{9}$/).required(),
            password: joi.string().required(),
            permission: joi.string().required(),
            email: joi.string().required()
            // permission: joi.string().regex(new RegExp(`^(${PERMISSION.ADMIN}|${PERMISSION.TEACHING_ASSISTANT}|${PERMISSION.STUDENT})$`)).required()
        }),
        userOptionalSchema:joi.object().keys({
            firstName: joi.string().alphanum().min(3).max(30),
            lastName: joi.string().alphanum().min(3).max(30),
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
            deadline: joi.date().required(),
            courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        submissionSchema: joi.object().keys({
            submissionDate: joi.string().required(),
            grade: joi.number().integer().min(0).max(100).required(),
            exercisePath: joi.string().required(),
            task: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            student: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        taskOptionalSchema: joi.object().keys({
            title: joi.string(),
            exercisePath: joi.string(),
            solutionPath: joi.string(),
            deadline: joi.date(),
            practiceTest: joi.string(),
            finalTest: joi.string(),
            exam: joi.boolean(),
            course: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        authenticationSchema: joi.object().keys({
            identityNumber: joi.string().regex(/^[0-9]{9}$/).required(),
            password: joi.string().required()
        }),
        enlistToCourseSchema: joi.object().keys({
            studentId: joi.string().regex(/^[0-9]{9}$/).required()
        }),
        submitForGradeSchema:  joi.object().keys({
            mode: joi.string().regex(new RegExp(`^(${MODE.FINAL}|${MODE.PRACTICE})$`)).required()
        }),
        testUnitSchema: joi.object().keys({
            title: joi.string().required(),
            description: joi.string(),
            compilationLine: joi.string().required(),
            task: joi.string().regex(/^[0-9]{9}$/)
        }),
        testSchema: joi.object().keys({
            units: joi.array().items(joi.object().keys({
                    test: joi.string().regex(/^[0-9]{9}$/).required(),
                    visibility: joi.string().regex(new RegExp(`^(${VISIBILITY.EXPOSED}|${VISIBILITY.HIDDEN})$`)).required()
                })
            )
        })
    }
};
