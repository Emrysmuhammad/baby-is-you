'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/storage.js');

const { Storage } = globalThis.BIY;

test('round-trips JSON values through the backend', () => {
  const storage = Storage.createStorage(Storage.memoryBackend(), 'test:');
  assert.equal(storage.set('record', { score: 3 }), true);
  assert.deepEqual(storage.get('record', null), { score: 3 });
});

test('returns the fallback when a key is missing', () => {
  const storage = Storage.createStorage(Storage.memoryBackend(), 'test:');
  assert.equal(storage.get('missing', 'fallback'), 'fallback');
});

test('returns the fallback when stored JSON is corrupt', () => {
  const backend = Storage.memoryBackend();
  backend.setItem('test:bad', '{nope');
  const storage = Storage.createStorage(backend, 'test:');
  assert.equal(storage.get('bad', 'fallback'), 'fallback');
});

test('reports failure instead of throwing when the backend rejects writes', () => {
  const backend = {
    getItem: () => null,
    setItem() {
      throw new Error('QuotaExceededError');
    },
  };
  assert.equal(Storage.createStorage(backend).set('k', 1), false);
});

test('falls back to memory when localStorage is unavailable', () => {
  const storage = Storage.createStorage(Storage.resolveBackend());
  assert.equal(storage.set('k', 'v'), true);
  assert.equal(storage.get('k', null), 'v');
});