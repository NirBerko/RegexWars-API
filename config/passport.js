const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    /*User.findById(id, (err, user) => {
     done(err, user);
     });*/
    done(null, user)
});

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    issuer: 'skillify.io',
    audience: 'skillify.io',
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()])
}, (jwt_payload, done) => {
    User.findById(jwt_payload.sub, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }

        return done(null, false);
    });
}));

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {msg: `Email ${email} not found.`});
        }
        if (!user.password)
            return done(null, false, {msg: `User already exists. Please sign in using this email.`});

        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, {msg: 'Invalid email or password.'});
        });
    });
}));