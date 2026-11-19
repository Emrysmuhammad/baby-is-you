/**
 * rules.js — finds active rules by reading word sentences on the grid.
 * A rule is { noun, prop }, for example { noun: 'baby', prop: 'you' }.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});
  const C = ns.Config;

  function wordsAt(list, x, y) {
    return list
      .filter((entity) => entity.kind === 'text' && entity.x === x && entity.y === y)
      .map((entity) => entity.name);
  }

  function findRules(list) {
    const rules = [];
    const seen = new Set();
    const directions = [[1, 0], [0, 1]];

    list.forEach((noun) => {
      if (noun.kind !== 'text' || !C.NOUNS.includes(noun.name)) return;
      directions.forEach(([dx, dy]) => {
        if (!wordsAt(list, noun.x + dx, noun.y + dy).includes(C.OPERATOR)) return;
        wordsAt(list, noun.x + 2 * dx, noun.y + 2 * dy)
          .filter((word) => C.PROPERTIES.includes(word))
          .forEach((prop) => {
            const key = `${noun.name}:${prop}`;
            if (!seen.has(key)) {
              seen.add(key);
              rules.push({ noun: noun.name, prop });
            }
          });
      });
    });
    return rules;
  }

  ns.Rules = Object.freeze({ findRules, wordsAt });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Rules;
  }
})(typeof window !== 'undefined' ? window : globalThis);