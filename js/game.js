/**
 * game.js — session state and page wiring.
 * applyAction is the testable core. bootstrap connects it to the page.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  function startSession(levelIndex) {
    const level = ns.Levels.LEVELS[levelIndex];
    if (!level) throw new Error(`No level at index ${levelIndex}`);
    return {
      levelIndex,
      state: ns.Grid.parseLevel(level.rows),
      history: ns.History.createHistory(),
      status: 'playing',
    };
  }

  function applyAction(session, action, progress) {
    if (action.type === 'restart') return startSession(session.levelIndex);

    if (action.type === 'undo') {
      const previous = session.history.pop();
      return previous ? { ...session, state: previous, status: 'playing' } : session;
    }

    if (action.type !== 'move' || session.status !== 'playing') return session;

    const result = ns.Movement.step(session.state, action.dir);
    if (!result.moved) return session;

    session.history.push(session.state);
    const resolved = ns.Conditions.resolve({ ...session.state, entities: result.entities });
    if (resolved.status === 'won' && progress) {
      progress.markCompleted(session.levelIndex);
    }
    return {
      ...session,
      state: { ...session.state, entities: resolved.entities, moves: session.state.moves + 1 },
      status: resolved.status,
    };
  }

  function describe(session) {
    if (session.status === 'won') return 'Level cleared! Pick the next level from the menu.';
    if (session.status === 'lost') return 'No YOU left. Press Undo or Restart.';
    return `Moves: ${session.state.moves}`;
  }

  function bootstrap(doc) {
    const boardEl = doc.getElementById('board');
    const rulesEl = doc.getElementById('rules');
    const statusEl = doc.getElementById('status');
    const selectEl = doc.getElementById('level-select');
    const storage = ns.Storage.createStorage(ns.Storage.resolveBackend());
    const progress = ns.Progress.createProgress(storage, ns.Levels.LEVELS.length);
    let session = startSession(0);

    function populateLevels() {
      const options = ns.Levels.LEVELS.map((level, index) => {
        const option = doc.createElement('option');
        option.value = String(index);
        option.textContent = `${index + 1}. ${level.name}`;
        option.disabled = !progress.isUnlocked(index);
        return option;
      });
      selectEl.replaceChildren(...options);
      selectEl.value = String(session.levelIndex);
    }

    function render() {
      ns.Render.renderBoard(boardEl, session.state);
      ns.Render.renderRules(rulesEl, ns.Rules.findRules(session.state.entities));
      ns.Render.renderStatus(statusEl, describe(session));
      statusEl.className = `status status--${session.status}`;
    }

    function dispatch(action) {
      session = applyAction(session, action, progress);
      populateLevels();
      render();
    }

    selectEl.addEventListener('change', () => {
      session = startSession(Number(selectEl.value));
      populateLevels();
      render();
    });

    doc.querySelectorAll('[data-dir], [data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        dispatch(button.dataset.dir
          ? { type: 'move', dir: button.dataset.dir }
          : { type: button.dataset.action });
      });
    });

    ns.Input.bindKeyboard(doc, dispatch);
    root.addEventListener('resize', render);
    populateLevels();
    render();
    return { dispatch };
  }

  ns.Game = Object.freeze({ startSession, applyAction, bootstrap });

  if (typeof document !== 'undefined' && document.getElementById('board')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => bootstrap(document));
    } else {
      bootstrap(document);
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Game;
  }
})(typeof window !== 'undefined' ? window : globalThis);