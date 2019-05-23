const User = require('../models/user');
const Course = require('../models/course');

module.exports = {
    index: async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json(users);
    },
    newUser: async (req, res, next) => {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(201).json(user);
    },
    getUser: async (req, res, next) => {
        const { userId } = req.value.params;
        const user = await User.findById(userId);
        res.status(200).json(user);
    },
    replaceUser: async (req, res, next) => {
        // enforce request.body contains all the fields
        const { userId } = req.params;
        const newUser = new User(req.body);
        await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User replaced successfully'
        });
    },
    updateUser: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.params;
        const newUser = new User(req.body);
        await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    },
    getUserCourses: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.params;
        const user = await User.findById(userId).populate('courses');
        res.status(200).json(user.courses);
    },
    enlistUserToCourse: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.params;
        const { courseId } = req.body;
        // Get user
        const user = await User.findById(userId);
        // Get Course
        const course = await Course.findById(courseId);
        user.courses.push(course);
        await user.save();
        course.enlisted.push(user);
        course.save();
        res.status(200).json({
            success: true,
            message: `Enlisted ${user.firstName} ${user.lastName} to '${course.title}' course successfully`
        })
    },
};
