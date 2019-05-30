const joi = require('joi');
const { SUBMISSION, LANGUAGES } = require('../configuration/supports');

module.exports = {
    validateParam: (schema, name) => {
        return (req, res, next) => {
            const result = joi.validate({param: req['params'][name]}, schema);
            if (result.error) {
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
            if (result.error) {
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
            password: joi.string().required()
        }),
        userOptionalSchema: joi.object().keys({
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
        enrollToCourseSchema: joi.object().keys({
            studentId: joi.string().regex(/^[0-9]{9}$/).required()
        }),
        submitForGradeSchema: joi.object().keys({
            mode: joi.string().regex(`^(${SUBMISSION.MODE.FINAL}|${SUBMISSION.MODE.PRACTICE})$`).required()
        }),
        removeFromCourseSchema: joi.object().keys({
            studentId: joi.string().regex(/^[0-9]{9}$/).required(),
            courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })
    }
};
