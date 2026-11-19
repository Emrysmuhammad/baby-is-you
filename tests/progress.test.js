'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/storage.js');
require('../js/progress.js');

const { Storage, Progress } = globalThis.BIY;

const make = (levelCount = 3) =>
  Progress.createProgress(Storage.createStorage(Storage.memoryBackend()), levelCount);

test('starts with only the first level unlocked', () => {
  const progress = make();
  assert.equal(progress.unlockedCount(), 1);
  assert.equal(progress.isUnlocked(0), true);
  assert.equal(progress.isUnlocked(1), false);
});

test('completing a level unlocks the next one', () => {
  const progress = make();
  assert.equal(progress.markCompleted(0), 2);
  assert.equal(progress.isUnlocked(1), true);
});

test('progress never moves backwards', () => {
  const progress = make();
  progress.markCompleted(2);
  progress.markCompleted(0);
  assert.equal(progress.unlockedCount(), 3);
});

test('unlocked count is capped at the number of levels', () => {
  const progress = make(3);
  assert.equal(progress.markCompleted(2), 3);
});

test('corrupt or oversized saved values are clamped', () => {
  const storage = Storage.createStorage(Storage.memoryBackend());
  const progress = Progress.createProgress(storage, 3);
  storage.set('progress', { unlocked: 999 });
  assert.equal(progress.unlockedCount(), 3);
  storage.set('progress', { unlocked: 'x' });
  assert.equal(progress.unlockedCount(), 1);
  storage.set('progress', null);
  assert.equal(progress.unlockedCount(), 1);
});

test('rejects out-of-range level indexes', () => {
  const progress = make(3);
  assert.throws(() => progress.markCompleted(3), /out of range/);
  assert.throws(() => progress.markCompleted(-1), /out of range/);
});

test('reset returns to the first level only', () => {
  const progress = make();
  progress.markCompleted(1);
  progress.reset();
  assert.equal(progress.unlockedCount(), 1);
});