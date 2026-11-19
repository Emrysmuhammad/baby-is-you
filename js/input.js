/**
 * input.js — maps key presses to game actions.
 * keyToAction is pure and testable; bindKeyboard wires it to the page.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  const move = (dir) => Object.freeze({ type: 'move', dir });
  const KEY_MAP = Object.freeze({
    ArrowUp: move('up'),
    w: move('up'),
    ArrowDown: move('down'),
    s: move('down'),
    ArrowLeft: move('left'),
    a: move('left'),
    ArrowRight: move('right'),
    d: move('right'),
    z: Object.freeze({ type: 'undo' }),
    u: Object.freeze({ type: 'undo' }),
    r: Object.freeze({ type: 'restart' }),
  });

  function keyToAction(rawKey) {
    const key = typeof rawKey === 'string' && rawKey.length === 1 ? rawKey.toLowerCase() : rawKey;
    if (!Object.prototype.hasOwnProperty.call(KEY_MAP, key)) return null;
    return { ...KEY_MAP[key] };
  }

  function bindKeyboard(target, dispatch) {
    target.addEventListener('keydown', (event) => {
      const action = keyToAction(event.key);
      if (!action) return;
      event.preventDefault();
      dispatch(action);
    });
  }

  ns.Input = Object.freeze({ keyToAction, bindKeyboard });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Input;
  }
})(typeof window !== 'undefined' ? window : globalThis);