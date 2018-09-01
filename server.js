const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const passport = require('passport');
const expressValidator = require('express-validator');

app.use(cors());

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({path: '.env.dev'});

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

require('./config/passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(passport.initialize());

app.use('/*', (req, res, next) => {
    next();
});

app.get('/userDetails', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user)
});

app.use('/auth', require('./routes/auth'));
app.use('/challenge', require('./routes/challenge'));

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));