/**
 * progress.js — remembers how many levels the player has unlocked.
 * Unlocked count is always between 1 and the number of levels.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  const KEY = 'progress';

  function clampCount(value, levelCount) {
    const count = Number.isInteger(value) ? value : 1;
    return Math.min(levelCount, Math.max(1, count));
  }

  function createProgress(storage, levelCount) {
    if (!Number.isInteger(levelCount) || levelCount < 1) {
      throw new Error('levelCount must be a positive integer');
    }

    function unlockedCount() {
      const saved = storage.get(KEY, {});
      const value = saved && typeof saved === 'object' ? saved.unlocked : undefined;
      return clampCount(value, levelCount);
    }

    return {
      unlockedCount,
      isUnlocked(index) {
        return Number.isInteger(index) && index >= 0 && index < unlockedCount();
      },
      markCompleted(index) {
        if (!Number.isInteger(index) || index < 0 || index >= levelCount) {
          throw new Error('Level index out of range');
        }
        const next = clampCount(Math.max(unlockedCount(), index + 2), levelCount);
        storage.set(KEY, { unlocked: next });
        return next;
      },
      reset() {
        storage.set(KEY, { unlocked: 1 });
      },
    };
  }

  ns.Progress = Object.freeze({ createProgress });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Progress;
  }
})(typeof window !== 'undefined' ? window : globalThis);