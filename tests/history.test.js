'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/history.js');

const { History } = globalThis.BIY;

test('snapshot makes a deep copy', () => {
  const state = {
    width: 1,
    height: 1,
    moves: 0,
    entities: [{ id: 1, kind: 'object', name: 'baby', x: 0, y: 0 }],
  };
  const copy = History.snapshot(state);
  state.entities[0].x = 9;
  assert.equal(copy.entities[0].x, 0);
});

test('pop returns the most recent snapshot first', () => {
  const history = History.createHistory(10);
  history.push({ moves: 1 });
  history.push({ moves: 2 });
  assert.deepEqual(history.pop(), { moves: 2 });
  assert.deepEqual(history.pop(), { moves: 1 });
});

test('pop returns null when empty', () => {
  assert.equal(History.createHistory().pop(), null);
});

test('drops the oldest snapshot beyond the limit', () => {
  const history = History.createHistory(2);
  history.push({ moves: 1 });
  history.push({ moves: 2 });
  history.push({ moves: 3 });
  assert.equal(history.size(), 2);
  assert.deepEqual(history.pop(), { moves: 3 });
  assert.deepEqual(history.pop(), { moves: 2 });
  assert.equal(history.pop(), null);
});

test('clear removes every snapshot', () => {
  const history = History.createHistory();
  history.push({ moves: 1 });
  history.clear();
  assert.equal(history.size(), 0);
});

test('rejects invalid limits', () => {
  assert.throws(() => History.createHistory(0), /positive integer/);
  assert.throws(() => History.createHistory(1.5), /positive integer/);
});