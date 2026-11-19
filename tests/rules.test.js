'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/grid.js');
require('../js/rules.js');

const { Grid, Rules } = globalThis.BIY;

test('finds a horizontal rule', () => {
  const state = Grid.parseLevel(['BIY']);
  assert.deepEqual(Rules.findRules(state.entities), [{ noun: 'baby', prop: 'you' }]);
});

test('finds a vertical rule', () => {
  const state = Grid.parseLevel(['W', 'I', 'S']);
  assert.deepEqual(Rules.findRules(state.entities), [{ noun: 'wall', prop: 'stop' }]);
});

test('finds several rules on the same board', () => {
  const state = Grid.parseLevel(['BIY', 'WIS']);
  assert.deepEqual(Rules.findRules(state.entities), [
    { noun: 'baby', prop: 'you' },
    { noun: 'wall', prop: 'stop' },
  ]);
});

test('ignores a noun that is not followed by IS', () => {
  const state = Grid.parseLevel(['BY.']);
  assert.deepEqual(Rules.findRules(state.entities), []);
});

test('ignores a third word that is not a property', () => {
  const state = Grid.parseLevel(['BIR']);
  assert.deepEqual(Rules.findRules(state.entities), []);
});

test('ignores an operator that is not directly after the noun', () => {
  const state = Grid.parseLevel(['BI.Y']);
  assert.deepEqual(Rules.findRules(state.entities), []);
});

test('deduplicates identical rules', () => {
  const state = Grid.parseLevel(['BIY', 'BIY']);
  assert.deepEqual(Rules.findRules(state.entities), [{ noun: 'baby', prop: 'you' }]);
});