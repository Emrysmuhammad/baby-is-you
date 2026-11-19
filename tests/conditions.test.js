'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/grid.js');
require('../js/rules.js');
require('../js/properties.js');
require('../js/conditions.js');

const { Grid, Conditions } = globalThis.BIY;

test('stays playing while YOU exists and nothing special is touched', () => {
  const state = Grid.parseLevel(['BIY....', '..@....']);
  assert.equal(Conditions.resolve(state).status, 'playing');
});

test('wins when YOU shares a cell with a WIN object', () => {
  const state = Grid.parseLevel(['BIY..', 'FIV..', '.....']);
  state.entities.push(
    { id: 10, kind: 'object', name: 'baby', x: 3, y: 2 },
    { id: 11, kind: 'object', name: 'flag', x: 3, y: 2 },
  );
  assert.equal(Conditions.resolve(state).status, 'won');
});

test('sinks YOU and the SINK object that share a cell', () => {
  const state = Grid.parseLevel(['BIY....', 'XIK....', '.....']);
  state.entities.push(
    { id: 10, kind: 'object', name: 'baby', x: 3, y: 2 },
    { id: 11, kind: 'object', name: 'water', x: 3, y: 2 },
  );
  const resolved = Conditions.resolve(state);
  assert.equal(resolved.status, 'lost');
  assert.equal(resolved.entities.some((e) => e.id === 10 || e.id === 11), false);
});

test('keeps unrelated objects when something sinks', () => {
  const state = Grid.parseLevel(['BIY....', 'XIK....', '.....']);
  state.entities.push(
    { id: 10, kind: 'object', name: 'baby', x: 3, y: 2 },
    { id: 11, kind: 'object', name: 'water', x: 3, y: 2 },
    { id: 12, kind: 'object', name: 'wall', x: 6, y: 2 },
  );
  const resolved = Conditions.resolve(state);
  assert.equal(resolved.entities.length, 7);
  assert.ok(resolved.entities.some((e) => e.id === 12));
});

test('loses when no YOU exists', () => {
  const state = Grid.parseLevel(['BIY..', '.....']);
  assert.equal(Conditions.resolve(state).status, 'lost');
});