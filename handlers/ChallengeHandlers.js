const DaoConfiguration = require('../DaoConfiguration');
const {FilterOutParams} = require('../utils/ResponseHandler');

const ChallengeToUI = (challenge) => {
    challenge[DaoConfiguration.CHALLENGE.FIELDS.TEST_CASES] = challenge[DaoConfiguration.CHALLENGE.FIELDS.TEST_CASES].map(testCase => {
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
    challenge = FilterOutParams(challenge, ['regex_answer', 'regex_mode', 'replace_with']);

    return challenge;
};

module.exports = {
    ChallengeToUI
};