'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/levels.js');
require('../js/grid.js');

const { Grid, Levels } = globalThis.BIY;

test('parses word and object tiles with coordinates', () => {
  const state = Grid.parseLevel(['B@', '.f']);
  assert.equal(state.width, 2);
  assert.equal(state.height, 2);
  assert.equal(state.moves, 0);
  const summary = state.entities.map((e) => [e.kind, e.name, e.x, e.y]);
  assert.deepEqual(summary, [
    ['text', 'baby', 0, 0],
    ['object', 'baby', 1, 0],
    ['object', 'flag', 1, 1],
  ]);
});

test('gives every entity a unique id', () => {
  const state = Grid.parseLevel(['BIY', '@@@']);
  const ids = new Set(state.entities.map((e) => e.id));
  assert.equal(ids.size, state.entities.length);
});

test('rejects rows of unequal width', () => {
  assert.throws(() => Grid.parseLevel(['..', '...']), /characters wide/);
});

test('rejects unknown tile characters', () => {
  assert.throws(() => Grid.parseLevel(['.?']), /Unknown tile/);
});

test('rejects empty input', () => {
  assert.throws(() => Grid.parseLevel([]), /at least one row/);
  assert.throws(() => Grid.parseLevel(['']), /cannot be empty/);
});

test('every bundled level parses', () => {
  Levels.LEVELS.forEach((level) => {
    assert.doesNotThrow(() => Grid.parseLevel(level.rows));
  });
});

test('inBounds accepts edges and rejects outside cells', () => {
  const state = Grid.parseLevel(['...', '...']);
  assert.equal(Grid.inBounds(state, 0, 0), true);
  assert.equal(Grid.inBounds(state, 2, 1), true);
  assert.equal(Grid.inBounds(state, 3, 0), false);
  assert.equal(Grid.inBounds(state, 0, -1), false);
});

test('entitiesAt returns only what sits on that cell', () => {
  const state = Grid.parseLevel(['B@']);
  assert.equal(Grid.entitiesAt(state.entities, 1, 0).length, 1);
  assert.equal(Grid.entitiesAt(state.entities, 0, 0).length, 1);
});

test('cloneEntities returns independent copies', () => {
  const state = Grid.parseLevel(['@']);
  const copy = Grid.cloneEntities(state.entities);
  copy[0].x = 9;
  assert.equal(state.entities[0].x, 0);
});