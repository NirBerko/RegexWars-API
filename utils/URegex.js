/**
 *
 * @param regexText
 * @param regexMode
 * @returns {undefined}
 */

const regexHandler = (regexText, regexMode) => {
    let regex = undefined;

    try {
        regex = new RegExp(regexText, regexMode);
    } catch (e) {
        regex = undefined;
    }

    return regex;
};

module.exports = {
    regexHandler
};