const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const DaoConfiguration = require('../DaoConfiguration');
const ChallengeHandlers = require('../handlers/ChallengeHandlers');

const ExceptionHandler = require('../utils/ExceptionHandler');

router.get('/all', async (req, res) => {
    try {
        const challenges = await Challenge.find().lean();

        res.json(challenges.map(challenge => ChallengeHandlers.ChallengeToUI(challenge)))
    } catch (e) {
        ExceptionHandler(req, res)(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id).lean();

        res.json(ChallengeHandlers.ChallengeToUI(challenge));
    } catch (e) {
        ExceptionHandler(req, res)(e);
    }
});

router.post('/', async (req, res) => {
    const {title, regex_answer, replace_with, test_cases} = req.body;

    let challenge = new Challenge({
        [DaoConfiguration.CHALLENGE.FIELDS.CHALLENGE_TITLE]: title,
        [DaoConfiguration.CHALLENGE.FIELDS.REGEX_ANSWER]: regex_answer,
        [DaoConfiguration.CHALLENGE.FIELDS.REPLACE_WITH]: replace_with,
        [DaoConfiguration.CHALLENGE.FIELDS.TEST_CASES]: test_cases
    });

    challenge = await challenge.save();

    res.json(challenge);
});

module.exports = router;