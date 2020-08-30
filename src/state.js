import { observe } from './observer';
import Watcher from './watcher';
import Dep from './dep';

export function initState(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {};

  Object.keys(data).forEach(key => {
    proxy(vm, '_data', key);
  });

  observe(data);
}

export function initComputed(vm) {
  const computed = vm.$options.computed;
  const watchers = (vm._computedWatchers = {});

  Object.keys(computed).forEach(key => {
    const userDef = computed[key];
    const getter = userDef;
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });

    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  });
}

function defineComputed(vm, key, userDef) {
  let getter = createComputedGetter(key);

  Object.defineProperty(vm, key, {
    enumerable: true,
    configurable: true,
    get: getter,
    set: () => {},
  });
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers[key];

    if (watcher.dirty) {
      watcher.evaluate();
    }

    if (Dep.target) {
      watcher.depend();
    }

    return watcher.value;
  };
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },

    set(value) {
      return (vm[source][key] = value);
    },
  });
}

export function initWatch(vm) {
  let watch = vm.$options.watch;

  Object.keys(watch).forEach(key => {
    new Watcher(vm, key, watch[key], { user: true });
  });
}
