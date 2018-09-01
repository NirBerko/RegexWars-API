const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const DaoConfiguration = require('../DaoConfiguration');
const ChallengeHandlers = require('../models/handlers/ChallengeHandlers');

const {regexHandler} = require('../utils/URegex');
const ExceptionHandler = require('../handlers/ExceptionHandler');

router.get('/all', async (req, res) => {
    try {
        const challenges = await Challenge.find().lean();

        res.json(challenges.map(challenge => ChallengeHandlers.ChallengeToUI(challenge)))
    } catch (e) {
        ExceptionHandler(res)(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id).lean();

        res.json(ChallengeHandlers.ChallengeToUI(challenge));
    } catch (e) {
        ExceptionHandler(res)(e);
    }
});

router.post('/:id/solution', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id).lean();

        if (challenge) {
            let succeeded = 0;
            challenge.test_cases.forEach((testCase) => {
                let regex = regexHandler(req.body.regex_answer, req.body.regex_mode);

                if (regex) {
                    let test = testCase.replace(regex, req.body.replace_width) === testCase.replace(regexHandler(challenge.regex_answer, challenge.regex_mode), challenge.replace_width);
                    if (test) {
                        succeeded = succeeded + 1;
                    }
                }
            });

            if (succeeded === challenge.test_cases.length) {
                res.sendStatus(200);
            } else {
                res.sendStatus(409);
            }
        }
    } catch (e) {
        ExceptionHandler(res)(e);
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