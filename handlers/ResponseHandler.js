const FilterResponse = (json, filterOut) => {
    filterOut.forEach(key => {
        delete json[key];
    });

    return json;
};

module.exports = {
    FilterResponse
};