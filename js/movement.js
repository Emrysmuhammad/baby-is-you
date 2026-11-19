/**
 * movement.js — pure movement resolution with chained pushing.
 * step(state, dir) returns { moved, entities } and never mutates its input.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});
  const { Grid, Rules, Properties } = ns;

  const DIRECTIONS = Object.freeze({
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  });

  // Plans the move of one entity, pushing anything pushable in front of it.
  // Returns false if the move is blocked by an edge or a STOP entity.
  function planPush(ctx, entity, dx, dy, moving) {
    if (moving.has(entity.id)) return true;
    const nx = entity.x + dx;
    const ny = entity.y + dy;
    if (!Grid.inBounds(ctx, nx, ny)) return false;
    moving.add(entity.id);

    const blockers = Grid.entitiesAt(ctx.entities, nx, ny).filter((b) => b.id !== entity.id);
    for (const blocker of blockers) {
      if (moving.has(blocker.id)) continue;
      if (Properties.hasProp(ctx.rules, blocker, 'stop')) return false;
      if (Properties.hasProp(ctx.rules, blocker, 'push') && !planPush(ctx, blocker, dx, dy, moving)) {
        return false;
      }
    }
    return true;
  }

  function step(state, dir) {
    const delta = DIRECTIONS[dir];
    if (!delta) throw new Error(`Unknown direction "${dir}"`);
    const [dx, dy] = delta;

    const rules = Rules.findRules(state.entities);
    const yous = state.entities.filter((e) => Properties.hasProp(rules, e, 'you'));
    if (yous.length === 0) return { moved: false, entities: state.entities };

    const ctx = { width: state.width, height: state.height, entities: state.entities, rules };
    const moving = new Set();
    const allowed = yous.every((you) => planPush(ctx, you, dx, dy, moving));
    if (!allowed) return { moved: false, entities: state.entities };

    const entities = state.entities.map((e) =>
      moving.has(e.id) ? { ...e, x: e.x + dx, y: e.y + dy } : { ...e },
    );
    return { moved: true, entities };
  }

  ns.Movement = Object.freeze({ DIRECTIONS, step });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Movement;
  }
})(typeof window !== 'undefined' ? window : globalThis);