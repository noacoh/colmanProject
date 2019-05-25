const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { JWT_SECRET } = require('../configuration');
const User = require('./models/user');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payLoad, done) =>{
    try {
        // find the user specified in token
        const user = await User.findById(payLoad.sub);
        if (!user) {
            // user not found
            return done(null, false);
        }
        done(user, true)
    } catch(err) {
        done(err,false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'identityNumber',

}, async (identityNumber, password, done) => {
    const user = await User.findOne({ identityNumber: identityNumber });
    if (!user) {
        // user not found
        return done(null, false);
    }
    // check if the password is correct
    // if not, handle it
    // otherwise, return the user
}));