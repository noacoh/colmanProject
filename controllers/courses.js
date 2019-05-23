const Course = require('../models/course');

module.exports = {
    index: async (req, res, next) => {
        const users = await Course.find({});
        res.status(200).json(users);
    },
    newCourse: async (req, res, next) => {
        const newCourse = new Course(req.body);
        const user = await newCourse.save();
        res.status(201).json(user); 
    }
};
