/**
 * properties.js — answers "what properties does this entity have right now?"
 * Words are always PUSH. Objects gain the properties of rules whose noun matches their name.
 */
(function (root) {
  'use strict';
  const ns = (root.BIY = root.BIY || {});

  function propsFor(rules, entity) {
    const props = new Set();
    if (entity.kind === 'text') {
      props.add('push');
      return props;
    }
    rules.forEach((rule) => {
      if (rule.noun === entity.name) props.add(rule.prop);
    });
    return props;
  }

  function hasProp(rules, entity, prop) {
    return propsFor(rules, entity).has(prop);
  }

  ns.Properties = Object.freeze({ propsFor, hasProp });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ns.Properties;
  }
})(typeof window !== 'undefined' ? window : globalThis);