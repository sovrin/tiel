import assert from 'assert';
import decache from 'decache';
import {describe} from 'mocha';

describe('nenv', () => {
    decache('../../src');

    describe('.env in project with small buffer size', () => {
        process.chdir(__dirname);
        process.env.TIEL_BUFFER_SIZE = "4";
        const {default: promise} = require('../../src');

        const TABLE = {
            'THIS-IS-A-RELATIVELY-VERY-LONG-KEY': '1',
        };

        it('should load parse and set process.env', () => {
            promise.then((variables) => {
                for (const key in TABLE) {
                    assert(TABLE[key] === variables[key]);
                    assert(variables[key] === process.env[key]);
                }
            })
        });
    });
});
