const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const DaoConfiguration = require('../DaoConfiguration');
const ExceptionHandler = require('../handlers/ExceptionHandler');
const {FilterResponse} = require('../handlers/ResponseHandler');

router.get('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id).lean();

        let challengeToUI = challenge;
        challengeToUI[DaoConfiguration.CHALLENGE.FIELDS.TEST_CASES] = challengeToUI[DaoConfiguration.CHALLENGE.FIELDS.TEST_CASES].map(testCase => {
            const regexAnswer = new RegExp(challenge[DaoConfiguration.CHALLENGE.FIELDS.REGEX_ANSWER], challenge[DaoConfiguration.CHALLENGE.FIELDS.REGEX_MODE]);

            let regexedTestCase = '';

            if (challenge[DaoConfiguration.CHALLENGE.FIELDS.REPLACE_WITH]) {
                regexedTestCase = testCase.replace(regexAnswer, challenge[DaoConfiguration.CHALLENGE.FIELDS.REPLACE_WITH]);
            }

            return {
                testCase: testCase,
                regexedTestCase
            };
        });
        challengeToUI = FilterResponse(challengeToUI, ['regex_answer', 'regex_mode', 'replace_with']);

        res.json(challengeToUI);

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