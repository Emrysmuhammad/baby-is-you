'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/input.js');

const { Input } = globalThis.BIY;

test('arrow keys and WASD both move', () => {
  assert.deepEqual(Input.keyToAction('ArrowUp'), { type: 'move', dir: 'up' });
  assert.deepEqual(Input.keyToAction('a'), { type: 'move', dir: 'left' });
  assert.deepEqual(Input.keyToAction('ArrowDown'), { type: 'move', dir: 'down' });
  assert.deepEqual(Input.keyToAction('d'), { type: 'move', dir: 'right' });
});

test('letter keys are case-insensitive', () => {
  assert.deepEqual(Input.keyToAction('D'), { type: 'move', dir: 'right' });
  assert.deepEqual(Input.keyToAction('R'), { type: 'restart' });
});

test('undo and restart keys map to their actions', () => {
  assert.deepEqual(Input.keyToAction('z'), { type: 'undo' });
  assert.deepEqual(Input.keyToAction('u'), { type: 'undo' });
  assert.deepEqual(Input.keyToAction('r'), { type: 'restart' });
});

test('unmapped keys return null', () => {
  assert.equal(Input.keyToAction('x'), null);
  assert.equal(Input.keyToAction('Enter'), null);
  assert.equal(Input.keyToAction('constructor'), null);
});

test('returned actions are copies', () => {
  const action = Input.keyToAction('ArrowUp');
  action.dir = 'down';
  assert.equal(Input.keyToAction('ArrowUp').dir, 'up');
});