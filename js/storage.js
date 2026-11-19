/**
 * storage.js — JSON storage that never throws.
 * Uses localStorage when it is available and writable, otherwise an in-memory map.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});
  const C = ns.Config;

  function memoryBackend() {
    const data = new Map();
    return {
      getItem: (key) => (data.has(key) ? data.get(key) : null),
      setItem: (key, value) => {
        data.set(key, String(value));
      },
      removeItem: (key) => {
        data.delete(key);
      },
    };
  }

  function resolveBackend() {
    try {
      const local = root.localStorage;
      if (!local) return memoryBackend();
      const probe = '__biy_probe__';
      local.setItem(probe, '1');
      local.removeItem(probe);
      return local;
    } catch (err) {
      return memoryBackend();
    }
  }

  function createStorage(backend, prefix = C.STORAGE_PREFIX) {
    return {
      get(key, fallback) {
        try {
          const raw = backend.getItem(prefix + key);
          if (raw === null) return fallback;
          return JSON.parse(raw);
        } catch (err) {
          return fallback;
        }
      },
      set(key, value) {
        try {
          backend.setItem(prefix + key, JSON.stringify(value));
          return true;
        } catch (err) {
          return false;
        }
      },
    };
  }

  ns.Storage = Object.freeze({ memoryBackend, resolveBackend, createStorage });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Storage;
  }
})(typeof window !== 'undefined' ? window : globalThis);