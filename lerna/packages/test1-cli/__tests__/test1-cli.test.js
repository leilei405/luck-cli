import test1Cli from '../src/test1-cli.js';
import { strict as assert } from 'assert';

assert.strictEqual(test1Cli(), 'Hello from test1Cli');
console.info('test1Cli tests passed');
