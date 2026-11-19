'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../js/config.js');
require('../js/levels.js');
require('../js/grid.js');
require('../js/rules.js');
require('../js/properties.js');
require('../js/movement.js');
require('../js/conditions.js');
require('../js/history.js');
require('../js/storage.js');
require('../js/progress.js');
require('../js/input.js');
require('../js/render.js');
require('../js/game.js');

const { Game, Grid, History, Storage, Progress, Levels } = globalThis.BIY;

const babyX = (session) =>
  session.state.entities.find((e) => e.kind === 'object' && e.name === 'baby').x;
const freshProgress = () =>
  Progress.createProgress(Storage.createStorage(Storage.memoryBackend()), Levels.LEVELS.length);

test('starts the first level playing with zero moves', () => {
  const session = Game.startSession(0);
  assert.equal(session.status, 'playing');
  assert.equal(session.state.moves, 0);
  assert.equal(session.levelIndex, 0);
});

test('a successful move changes position and counts a move', () => {
  const before = Game.startSession(0);
  const after = Game.applyAction(before, { type: 'move', dir: 'right' }, null);
  assert.notEqual(after, before);
  assert.equal(babyX(after), 5);
  assert.equal(after.state.moves, 1);
  assert.equal(after.history.size(), 1);
});

test('a blocked move returns the same session object', () => {
  const session = {
    levelIndex: 0,
    state: Grid.parseLevel(['BIY', '..@']),
    history: History.createHistory(),
    status: 'playing',
  };
  assert.equal(Game.applyAction(session, { type: 'move', dir: 'down' }, null), session);
});

test('undo restores the previous state', () => {
  const s0 = Game.startSession(0);
  const s1 = Game.applyAction(s0, { type: 'move', dir: 'right' }, null);
  const s2 = Game.applyAction(s1, { type: 'undo' }, null);
  assert.equal(babyX(s2), 4);
  assert.equal(s2.state.moves, 0);
  assert.equal(s2.status, 'playing');
});

test('undo with no history returns the same session', () => {
  const s0 = Game.startSession(0);
  assert.equal(Game.applyAction(s0, { type: 'undo' }, null), s0);
});

test('restart returns to the level start', () => {
  const s0 = Game.startSession(0);
  const s1 = Game.applyAction(s0, { type: 'move', dir: 'right' }, null);
  const s2 = Game.applyAction(s1, { type: 'restart' }, null);
  assert.equal(babyX(s2), 4);
  assert.equal(s2.state.moves, 0);
});

test('reaching the flag wins and unlocks the next level', () => {
  const progress = freshProgress();
  let session = Game.startSession(0);
  session = Game.applyAction(session, { type: 'move', dir: 'right' }, progress);
  session = Game.applyAction(session, { type: 'move', dir: 'right' }, progress);
  assert.equal(session.status, 'won');
  assert.equal(progress.unlockedCount(), 2);
});

test('moves are ignored after a level is won', () => {
  const progress = freshProgress();
  let session = Game.startSession(0);
  session = Game.applyAction(session, { type: 'move', dir: 'right' }, progress);
  session = Game.applyAction(session, { type: 'move', dir: 'right' }, progress);
  assert.equal(Game.applyAction(session, { type: 'move', dir: 'left' }, progress), session);
});