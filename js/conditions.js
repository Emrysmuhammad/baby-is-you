/**
 * conditions.js — resolves sinking, winning and defeat after a move.
 * resolve(state) returns { entities, status } where status is 'playing', 'won' or 'lost'.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});
  const { Rules, Properties } = ns;

  function resolve(state) {
    const rules = Rules.findRules(state.entities);
    const doomed = new Set();

    state.entities.forEach((you) => {
      if (!Properties.hasProp(rules, you, 'you')) return;
      state.entities.forEach((other) => {
        if (
          other.id !== you.id &&
          other.x === you.x &&
          other.y === you.y &&
          Properties.hasProp(rules, other, 'sink')
        ) {
          doomed.add(you.id);
          doomed.add(other.id);
        }
      });
    });

    const entities = state.entities.filter((e) => !doomed.has(e.id));
    const yous = entities.filter((e) => Properties.hasProp(rules, e, 'you'));
    if (yous.length === 0) return { entities, status: 'lost' };

    const won = yous.some((you) =>
      entities.some(
        (other) =>
          other.id !== you.id &&
          other.x === you.x &&
          other.y === you.y &&
          Properties.hasProp(rules, other, 'win'),
      ),
    );
    return { entities, status: won ? 'won' : 'playing' };
  }

  ns.Conditions = Object.freeze({ resolve });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Conditions;
  }
})(typeof window !== 'undefined' ? window : globalThis);