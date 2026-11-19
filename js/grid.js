/**
 * grid.js — converts level text into entity lists and offers position helpers.
 * An entity is { id, kind: 'object' | 'text', name, x, y }.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  const obj = (name) => ({ kind: 'object', name });
  const txt = (name) => ({ kind: 'text', name });

  const CHAR_MAP = Object.freeze({
    '@': obj('baby'), w: obj('wall'), r: obj('rock'), f: obj('flag'), x: obj('water'),
    B: txt('baby'), W: txt('wall'), R: txt('rock'), F: txt('flag'), X: txt('water'),
    I: txt('is'), Y: txt('you'), S: txt('stop'), P: txt('push'), V: txt('win'), K: txt('sink'),
  });

  function parseLevel(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Level needs at least one row');
    }
    const width = rows[0].length;
    if (width === 0) {
      throw new Error('Level rows cannot be empty');
    }
    rows.forEach((row, y) => {
      if (typeof row !== 'string' || row.length !== width) {
        throw new Error(`Row ${y} must be ${width} characters wide`);
      }
    });

    const entities = [];
    let nextId = 1;
    rows.forEach((row, y) => {
      for (let x = 0; x < width; x += 1) {
        const ch = row[x];
        if (ch === '.') continue;
        const tile = CHAR_MAP[ch];
        if (!tile) throw new Error(`Unknown tile "${ch}" at ${x},${y}`);
        entities.push({ id: nextId, kind: tile.kind, name: tile.name, x, y });
        nextId += 1;
      }
    });
    return { width, height: rows.length, moves: 0, entities };
  }

  function cloneEntities(list) {
    return list.map((entity) => ({ ...entity }));
  }

  function inBounds(state, x, y) {
    return x >= 0 && y >= 0 && x < state.width && y < state.height;
  }

  function entitiesAt(list, x, y) {
    return list.filter((entity) => entity.x === x && entity.y === y);
  }

  ns.Grid = Object.freeze({ CHAR_MAP, parseLevel, cloneEntities, inBounds, entitiesAt });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Grid;
  }
})(typeof window !== 'undefined' ? window : globalThis);