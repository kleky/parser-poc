const itemParser =  require('./shortcode-parser');
const stopWatch = require('stopwatch-node').StopWatch;

describe('flattens keys', () => {

    test('1 param - flattens params into single object', () => {
      const results = itemParser.flattenObject({
          "action": "action",
          "params": {
              "refDoc": "refDoc1"
          },
          "app": "app"
      })

      expect(results).toStrictEqual({
          "action": "action",
          "refDoc": "refDoc1",
          "app": "app"
      });
    });

    test('multiple params - flattens params into single object', () => {
        const results = itemParser.flattenObject({
            "e": "action",
            "params": {
                "c": "refDoc1",
                "b": "refDoc1",
                "a": "refDoc1",
            },
            "d": "app"
        })

        expect(results).toStrictEqual({
            "e": "action",
            "c": "refDoc1",
            "b": "refDoc1",
            "a": "refDoc1",
            "d": "app"
        });
    });
});

describe('findDuplicates', () => {

    let sw;

    beforeEach(() => {
        sw = new stopWatch();
        sw.start();
    });

    afterEach(() => {
        sw.stop();
        console.log(sw.shortSummary());
    });

    test('2 items - keys in same order finds 1 duplicate', () => {

        const results = itemParser.findDuplicates([
            {
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
                "app": "app"
            },
            {
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
                "app": "app"
            }
        ])

        expect(results).toEqual({
            repeated: [{
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
                "app": "app"
            }],
            totalRepeatedInList: 1,
        });

    });

    test('2 items - app key in different order - finds 1 duplicate', () => {

        const results = itemParser.findDuplicates([
            {
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
                "app": "app"
            },
            {
                "app": "app",
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
            }
        ])

        expect(results).toEqual({
            repeated: [{
                "app": "app",
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
            }],
            totalRepeatedInList: 1,
        });

    });

    test('2 items - multiple params in different order - finds 1 duplicate', () => {

        const results = itemParser.findDuplicates([
            {
                "d": "action",
                "params": {
                    "c": "refDocC",
                    "b": "refDocB",
                    "a": "refDocA",
                },
                "e": "app"
            },
            {
                "e": "app",
                "d": "action",
                "params": {
                    "a": "refDocA",
                    "b": "refDocB",
                    "c": "refDocC",
                },
            }
        ])

        expect(results).toEqual({
            repeated: [
                {
                    "e": "app",
                    "d": "action",
                    "params": {
                        "a": "refDocA",
                        "b": "refDocB",
                        "c": "refDocC",
                    },
                }
            ],
            totalRepeatedInList: 1,
        });

    });

    test('3 items - multiple params in different order - finds 2 duplicates', () => {

        const results = itemParser.findDuplicates([
            {
                "app": "app",
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
            },
            {
                "action": "action",
                "app": "app",
                "params": {
                    "refDoc": "refDoc1"
                },
            },
            {
                "action": "action",
                "params": {
                    "refDoc": "refDoc1"
                },
                "app": "app",
            }
        ])

        expect(results).toEqual({
            repeated: [
                {
                    "action": "action",
                    "app": "app",
                    "params": {
                        "refDoc": "refDoc1"
                    },
                },
                {
                    "action": "action",
                    "params": {
                        "refDoc": "refDoc1"
                    },
                    "app": "app",
                }
            ],
            totalRepeatedInList: 2,
        });

    });

    test('1000 items - test file - finds 25 duplicates', () => {

        const items = require('./items.json');

        const results = itemParser.findDuplicates(items)

        expect(results.repeated.length).toEqual(25);
        expect(results.totalRepeatedInList).toEqual(25);

    });


});
