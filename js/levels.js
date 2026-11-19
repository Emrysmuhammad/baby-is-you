/**
 * levels.js — bundled level definitions.
 * Legend: lowercase = object (@ baby, w wall, r rock, f flag, x water).
 *         uppercase = word   (B W R F X nouns; I is; Y S P V K properties).
 *         '.' = empty.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  ns.Levels = Object.freeze({
    LEVELS: Object.freeze([
      {
        name: 'First Steps',
        rows: [
          '........',
          '.BIY....',
          '....@.f.',
          '.FIV....',
          '........',
        ],
      },
      {
        name: 'Push It',
        rows: [
          'WIS......',
          '.BIY....w',
          '...@r..f.',
          '.........',
          'FIV......',
          'RIP......',
        ],
      },
      {
        name: 'Sink or Swim',
        rows: [
          'XIK.....',
          '.BIY....',
          '..@x.f..',
          '........',
          'FIV.....',
        ],
      },
    ]),
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Levels;
  }
})(typeof window !== 'undefined' ? window : globalThis);