const FilterOutParams = (json, filterOut) => {
    filterOut.forEach(key => {
        delete json[key];
    });
    return json;
};

module.exports = {
    FilterOutParams
};