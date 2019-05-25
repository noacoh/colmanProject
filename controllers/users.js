const JWT = require('jsonwebtoken');
const User = require('../models/user');
const Course = require('../models/course');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'ColmanSubSystem',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)

    }, JWT_SECRET)// TODO generate secret string and replace here
};
module.exports = {
    index: async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json(users);
    },
    signIn: async (req, res, next) => {
        const { identityNumber, password } = req.value.body;
        const user = await User.find({
            identityNumber: identityNumber,
            password:password
        });
        const token = signToken(user)
        res.status(200).json({
            token: token
        });
    },
    secret: async (req, res, next) => {
    },
    newUser: async (req, res, next) => {
        const newUser = new User(req.value.body);
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
        const { userId } = req.value.params;
        const newUser = new User(req.value.body);
        await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User replaced successfully'
        });
    },
    updateUser: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.value.params;
        const newUser = new User(req.value.body);
        await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    },
    getUserCourses: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.value.params;
        const user = await User.findById(userId).populate('courses');
        res.status(200).json(user.courses);
    },
    enlistUserToCourse: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId, courseId } = req.value.params;
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
