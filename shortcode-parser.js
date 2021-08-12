function findDuplicates(items) {
    let result = {
        repeated: [],
        totalRepeatedInList: 0,
    }

    const entries = items.map(i => ({
        original: i,
        entries: JSON.stringify(
            Object.entries(
                flattenObject(i)
            ).sort()
        )
    }));

    for (let i = 1; i < entries.length; i++) {
        if (entries[i].entries === entries[i-1].entries) {
            result.repeated.push(entries[i].original);
            result.totalRepeatedInList++;
        }
    }

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
