/**
 * render.js — draws the board, active rules and status text into the page.
 * Screen code only: game decisions are never made here.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});
  const C = ns.Config;

  function tileElement(doc, entity) {
    const tile = doc.createElement('div');
    if (entity.kind === 'object') {
      tile.className = `tile tile--object tile--${entity.name}`;
      tile.textContent = C.OBJECT_GLYPHS[entity.name] || '?';
    } else {
      tile.className = 'tile tile--word';
           tile.textContent = entity.name.toUpperCase();
    }
    return tile;
  }

  function cellSizeFor(width) {
    const fit = Math.floor((root.innerWidth - C.BOARD_PADDING_PX) / width);
    return Math.max(C.CELL_MIN_PX, Math.min(C.CELL_MAX_PX, fit));
  }

  function renderBoard(boardEl, state) {
    const doc = boardEl.ownerDocument;
    boardEl.style.setProperty('--cell', `${cellSizeFor(state.width)}px`);
    boardEl.style.gridTemplateColumns = `repeat(${state.width}, var(--cell))`;
    const fragment = doc.createDocumentFragment();
    for (let y = 0; y < state.height; y += 1) {
      for (let x = 0; x < state.width; x += 1) {
        const cell = doc.createElement('div');
        cell.className = 'cell';
        ns.Grid.entitiesAt(state.entities, x, y).forEach((entity) => {
          cell.appendChild(tileElement(doc, entity));
        });
        fragment.appendChild(cell);
      }
    }
    boardEl.replaceChildren(fragment);
  }

  function renderRules(listEl, rules) {
    const doc = listEl.ownerDocument;
    const labels = rules.length === 0
      ? ['No active rules']
      : rules.map((rule) => `${rule.noun.toUpperCase()} IS ${rule.prop.toUpperCase()}`);
    listEl.replaceChildren(...labels.map((text) => {
      const item = doc.createElement('li');
      item.textContent = text;
      return item;
    }));
  }

  function renderStatus(el, text) {
    el.textContent = text;
  }

  ns.Render = Object.freeze({ cellSizeFor, renderBoard, renderRules, renderStatus });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Render;
  }
})(typeof window !== 'undefined' ? window : globalThis);