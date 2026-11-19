'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/levels.js');

const { Levels } = globalThis.BIY;

test('there is at least one level', () => {
  assert.ok(Levels.LEVELS.length >= 1);
});

test('every level has a name and rectangular rows', () => {
  Levels.LEVELS.forEach((level) => {
    assert.equal(typeof level.name, 'string');
    assert.ok(level.name.length > 0);
    const width = level.rows[0].length;
    level.rows.forEach((row) => assert.equal(row.length, width));
  });
});