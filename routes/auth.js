const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/user');

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

router.post('/register', async (req, res) => {
    const newUser = new UserModel({
        email: 'nirberko@gmail.com',
        password: 'm1ub8wx3',
    });
    await newUser.save();
    res.sendStatus(200);
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