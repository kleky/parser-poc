const sort = require('fast-sort').sort;

function findDuplicates(items) {
    let result = {
        repeated: [],
        totalRepeatedInList: 0,
    }

    const entries = items.map(i => ({
        cache: i,
        objectValue: Object
                .entries(flattenObject(i))
                .sort() // sort keys
                .map(e => e[0] + e[1]) // concat key and value
                .reduce((prev, curr) => prev + curr) // concat all key values

    }));

    const sorted = sort(entries).asc(e => e.objectValue);

    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].objectValue === sorted[i + 1].objectValue) {
            result.repeated.push(sorted[i].cache);
        }
    }
    result.totalRepeatedInList = result.repeated.length;

    return result;
}

function flattenObject(item) {
    let res = {};
    for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'object') {
            res = { ...res, ...flattenObject(value) };
        } else {
            res[key] = value;
        }
    }
    return res;
}

module.exports = {
    findDuplicates,
    flattenObject
};
