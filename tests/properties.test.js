'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/grid.js');
require('../js/rules.js');
require('../js/properties.js');

const { Grid, Rules, Properties } = globalThis.BIY;

test('words are always pushable', () => {
  const state = Grid.parseLevel(['BIY']);
  const rules = Rules.findRules(state.entities);
  const word = state.entities.find((e) => e.name === 'is');
  assert.equal(Properties.hasProp(rules, word, 'push'), true);
});

test('objects gain the property of their noun rule', () => {
  const state = Grid.parseLevel(['BIY', '@..']);
  const rules = Rules.findRules(state.entities);
  const baby = state.entities.find((e) => e.kind === 'object' && e.name === 'baby');
  assert.equal(Properties.hasProp(rules, baby, 'you'), true);
});

test('objects without a matching rule have no properties', () => {
  const state = Grid.parseLevel(['BIY', '..w']);
  const rules = Rules.findRules(state.entities);
  const wall = state.entities.find((e) => e.kind === 'object' && e.name === 'wall');
  assert.equal(Properties.propsFor(rules, wall).size, 0);
});

test('words do not take noun rule properties', () => {
  const state = Grid.parseLevel(['BIY']);
  const rules = Rules.findRules(state.entities);
  const word = state.entities.find((e) => e.kind === 'text' && e.name === 'baby');
  assert.equal(Properties.hasProp(rules, word, 'you'), false);
});