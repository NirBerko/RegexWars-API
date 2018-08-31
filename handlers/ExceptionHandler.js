const colors = require('colors');

/**
 *
 * @param req
 * @param res
 */
module.exports = (req, res) => (e) => {
    console.log(colors.red(e));
    res.sendStatus(439);
};

