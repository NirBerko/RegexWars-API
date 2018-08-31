const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

app.use(cors());

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({path: '.env.dev'});

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/*', (req, res, next) => {
    next();
});

app.use('/challenge', require('./routes/challenge'));

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));