const JWT = require('jsonwebtoken');
const { User, PERMISSION } = require('../models/user');
const Student = require('../models/student');
const { JWT_SECRET, TOKEN_EXPIRATION } = require('../configuration');
const { usersActivityLogger } = require('../configuration/winston');

signToken = user => {
    return JWT.sign({
        iss: 'ColmanSubSystem',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + TOKEN_EXPIRATION)

    }, JWT_SECRET)
};
module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const users = await User.find({});
        res.status(200).json(users);
    },
    signIn: async (req, res, next) => {
        const token = signToken(req.user);
        usersActivityLogger.info({id: req.user.identityNumber, message: "logged in"});
        res.status(200).json({ token });
    },
    newUser: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { permission } = req.value.body;
        if (permission === PERMISSION.STUDENT) {
            const newStudent = new Student(req.value.body);
            await newStudent.save();
        } else {
            const newUser = new User(req.value.body);
            await newUser.save();
        }
        res.status(201).json({
            success: true,
            message: "new user created successfully"
        });
    },
    getUser: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
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
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { userId } = req.value.params;
        const newUser = new User(req.value.body);
        await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    }
};
