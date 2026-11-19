'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/grid.js');
require('../js/rules.js');
require('../js/properties.js');
require('../js/movement.js');

const { Grid, Movement } = globalThis.BIY;

const baby = (entities) => entities.find((e) => e.kind === 'object' && e.name === 'baby');
const rockXs = (entities) =>
  entities
    .filter((e) => e.kind === 'object' && e.name === 'rock')
    .map((e) => e.x)
    .sort((a, b) => a - b);

test('moves you into empty space', () => {
  const state = Grid.parseLevel(['BIY....', '..@....', '.......']);
  const result = Movement.step(state, 'down');
  assert.equal(result.moved, true);
  assert.equal(baby(result.entities).y, 2);
});

test('refuses to move off the board', () => {
  const state = Grid.parseLevel(['BIY', '..@']);
  const result = Movement.step(state, 'down');
  assert.equal(result.moved, false);
  assert.equal(baby(result.entities).y, 1);
});

test('is blocked by a STOP object', () => {
  const state = Grid.parseLevel(['BIY....', 'WIS....', '..@w...']);
  const result = Movement.step(state, 'right');
  assert.equal(result.moved, false);
  assert.equal(baby(result.entities).x, 2);
});

test('pushes a chain of rocks that are PUSH', () => {
  const state = Grid.parseLevel(['BIY....', 'RIP....', '.@rr...']);
  const result = Movement.step(state, 'right');
  assert.equal(result.moved, true);
  assert.equal(baby(result.entities).x, 2);
  assert.deepEqual(rockXs(result.entities), [3, 4]);
});

test('a push fails when the chain hits the board edge', () => {
  const state = Grid.parseLevel(['BIY..', 'RIP..', '..@rr']);
  const result = Movement.step(state, 'right');
  assert.equal(result.moved, false);
  assert.equal(baby(result.entities).x, 2);
  assert.deepEqual(rockXs(result.entities), [3, 4]);
});

test('does nothing when no entity is YOU', () => {
  const state = Grid.parseLevel(['..@', '...']);
  const result = Movement.step(state, 'right');
  assert.equal(result.moved, false);
});

test('rejects an unknown direction', () => {
  const state = Grid.parseLevel(['BIY', '..@']);
  assert.throws(() => Movement.step(state, 'diagonal'), /Unknown direction/);
});

test('does not mutate the input state', () => {
  const state = Grid.parseLevel(['BIY....', '..@....', '.......']);
  const before = JSON.stringify(state.entities);
  Movement.step(state, 'down');
  assert.equal(JSON.stringify(state.entities), before);
});