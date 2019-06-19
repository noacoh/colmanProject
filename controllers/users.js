const JWT = require('jsonwebtoken');
const { User, PERMISSION } = require('../models/user');
const Student = require('../models/student');
const { JWT_SECRET, TOKEN_EXPIRATION } = require('../configuration');
const { usersActivityLogger } = require('../configuration/winston');
const { Token } = require('../models/verificartionToken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
        if (!resourceRequester.isAdmin()) {
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
    signUp: async (req, res, next) => {
        const { firstName, lastName, identityNumber, password, permission, email } = req.value.body;
        const existingUser = User.findOne({email});
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'The email address you have entered is already associated with another account'
            });
        }
        let user;
        try {
            if (permission === PERMISSION.STUDENT) {
                const newStudent = new Student({
                    firstName,
                    lastName,
                    identityNumber,
                    password,
                    permission,
                    email
                });
                user = await newStudent.save();
            } else {
                const newUser = new User({
                    firstName,
                    lastName,
                    identityNumber,
                    password,
                    permission,
                    email
                });
                user  = await newUser.save();
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to save new user',
                error: err.toString()
            });
        }
        // Create a verification token for this user
        const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        try{
            await token.save();
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to generate verification token',
                error: err.toString()
            });
        }
        // send verification email
        const transporter = nodemailer.createTransport({
            service: 'Sendgrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
        try {
            await transporter.sendMail({
                from: 'no-reply@colman.com',
                to: user.email,
                subject: 'סיום הרשמה למערכת ההגשה',
                text: `Please verify your account by clicking the link:\nhttp:\/\/${req.headers.host}\/users\/confirmation\/${token.token}.\n`
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to send verification email',
                error: err.toString()})
        }
        res.status(200).json({
            success: true,
            message: `A verification email has been sent to ${user.email}`
        });
    },
    newUser: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { firstName, lastName, identityNumber, password, permission, email } = req.value.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'The email address you have entered is already associated with another account'
            });
        }
        try {
            if (permission === PERMISSION.STUDENT) {
                const newStudent = new Student({
                    firstName,
                    lastName,
                    identityNumber,
                    password,
                    permission,
                    email,
                    isVerified: true
                });
                await newStudent.save();
            } else {
                const newUser = new User({
                    firstName,
                    lastName,
                    identityNumber,
                    password,
                    permission,
                    email,
                    isVerified: true
                });
                await newUser.save();
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to save new user',
                error: err.toString()
            });
        }
        res.status(201).json({
            success: true,
            message: "new user created successfully"
        });
    },
    confirmEmail: async (req, res, next) => {
        const { tokenParam } = req.value.params;
        const token = await Token.findOne({token: tokenParam});
        if (!token) {
            res.status(400).json({
                success: false,
                message: 'Unable to verify email. The link my have expired'
            })
        }
        const user = await User.findById(token._userId);
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Unable to find user'
            })
        }
        if (user.isVerified) {
            res.status(400).json({
                success: false,
                message: 'The account has already been verified'
            })
        }
        // Verify and save the user
        user.isVerified = true;
        try {
            await user.save();
        } catch(err){
            res.status(500).json({
                success: false,
                message: 'Failed to save user as verified account',
                error: err.toString()
            })
        }
        res.status(200).json({
            success: true,
            message: "The account has been verified. Please log in."
        });
    },
    resendToken: async (req, res, next) => {
        const { email } = req.value.body;
        const user = await User.findOne({email});
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Unable to find account with the specified email.'
            })
        }
        if (user.isVerified) {
            res.status(400).json({
                success: false,
                message: 'The accound has already been verified. Please sign in to continue'
            })
        }
        // Create a verification token for this user
        const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        try{
            await token.save();
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to generate verification token',
                error: err.toString()
            });
        }
        // send verification email
        const transporter = nodemailer.createTransport({
            service: 'Sendgrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
        try {
            await transporter.sendMail({
                from: 'no-reply@colman.com',
                to: user.email,
                subject: 'סיום הרשמה למערכת ההגשה',
                text: `Please verify your account by clicking the link:\nhttp:\/\/${req.headers.host}\/users\/confirmation\/${token.token}.\n`
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to send verification email',
                error: err.toString()})
        }
        res.status(200).json({
            success: true,
            message: `A verification email has been sent to ${user.email}`
        });
    },
    getUser: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
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
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { userId } = req.value.params;
        const newUser = req.value.body;
        await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    }
};
