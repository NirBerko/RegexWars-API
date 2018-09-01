const mongoose = require('mongoose');
const DaoConfiguration = require('../DaoConfiguration');

const ChallengeSchema = new mongoose.Schema({
    [DaoConfiguration.CHALLENGE.FIELDS.CHALLENGE_TITLE]: {
        type: String,
        required: true,
    },
    [DaoConfiguration.CHALLENGE.FIELDS.REGEX_ANSWER]: {
        type: String,
        required: true,
    },
    [DaoConfiguration.CHALLENGE.FIELDS.REGEX_MODE]: {
        type: String,
        default: 'g',
    },
    [DaoConfiguration.CHALLENGE.FIELDS.TEST_CASES]: {
        type: [String],
        required: true,
        default: [],
    },
    [DaoConfiguration.CHALLENGE.FIELDS.REPLACE_WITH]: {
        type: String,
    },
}, {timestamps: true});

module.exports = mongoose.model(DaoConfiguration.CHALLENGE.MODEL_NAME, ChallengeSchema);