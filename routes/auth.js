const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/user');

const errorsData = require('../data/errors');
const ExceptionHandler = require('../handlers/ExceptionHandler');
const {SendConflict} = require('../handlers/ResponseHandler');

router.post('/login', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info.msg);
        }

        req.logIn(user, (err) => next(err));
    })(req, res, next);
});

router.post('/register', async (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    UserModel.findOne({email: req.body.email}, (err, existingUser) => {
        let user = existingUser;

        if (err) {
            return next(err);
        }
        if (user) {
            return SendConflict(res)(errorsData.authentication.accountEmailExists)
        } else {
            try {
                user = new UserModel({
                    email: req.body.email,
                    password: req.body.password,
                });
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }

                    // mailer

                    req.logIn(user, (err) => next(err))
                });
            } catch (e) {
                ExceptionHandler(res)(e);
            }
        }
    });
});

router.use((req, res) => {
    const token = jwt.sign({sub: req.user._id}, process.env.JWT_SECRET, {
        expiresIn: '2 days',
        issuer: process.env.issuer,
        audience: process.env.audience,
    });

    res.json({
        token,
        user: {
            _id: req.user._id,
            email: req.user.user,
        }
    })
});

module.exports = router;