const FilterOutParams = (json, filterOut) => {
    filterOut.forEach(key => {
        delete json[key];
    });
    return json;
};

/**
 *
 * @param res
 * @constructor
 */
const SendConflict = (res) => ({errorCode, error}) => {
    return res.status(409).send({
        errorCode,
        error
    })
};

module.exports = {
    FilterOutParams,
    SendConflict
};