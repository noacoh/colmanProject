const User = require('../models/user');

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
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.status(200).json(user);
    },
    replaceUser: async (req, res, next) => {
        // enforce request.body contains all the fields
        const { userId } = req.params;
        const newUser = new User(req.body);
        const result = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User replaced successfully'
        });
    },
    updateUser: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.params;
        const newUser = new User(req.body);
        const result = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    },
};
