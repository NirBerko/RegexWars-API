const colors = require('colors');

/**
 *
 * @param res
 */
module.exports = (res) => (e) => {
    console.log(colors.red(e));
    res.sendStatus(409);
};

