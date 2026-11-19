/**
 * config.js — central place for tunable values and game vocabulary.
 * Loaded first. Every other module reads from window.BIY.Config.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  ns.Config = Object.freeze({
    STORAGE_PREFIX: 'biy:',
    MAX_UNDO: 500,
    CELL_MIN_PX: 24,
    CELL_MAX_PX: 48,
    BOARD_PADDING_PX: 40,
    NOUNS: Object.freeze(['baby', 'wall', 'rock', 'flag', 'water']),
    PROPERTIES: Object.freeze(['you', 'stop', 'push', 'win', 'sink']),
    OPERATOR: 'is',
    OBJECT_GLYPHS: Object.freeze({
      baby: 'b',
      wall: '#',
      rock: 'o',
      flag: 'F',
      water: '~',
    }),
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Config;
  }
})(typeof window !== 'undefined' ? window : globalThis);