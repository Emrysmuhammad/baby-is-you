/**
 * history.js — bounded undo stack of deep-copied snapshots.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});
  const C = ns.Config;

  function snapshot(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function createHistory(max = C.MAX_UNDO) {
    if (!Number.isInteger(max) || max < 1) {
      throw new Error('History limit must be a positive integer');
    }
    const stack = [];
    return {
      push(state) {
        stack.push(snapshot(state));
        if (stack.length > max) stack.shift();
      },
      pop() {
        return stack.length > 0 ? stack.pop() : null;
      },
      size() {
        return stack.length;
      },
      clear() {
        stack.length = 0;
      },
    };
  }

  ns.History = Object.freeze({ snapshot, createHistory });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.History;
  }
})(typeof window !== 'undefined' ? window : globalThis);