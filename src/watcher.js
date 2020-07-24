import { pushTarget, popTarget } from './dep';

let uid = 0;

export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    } else {
      this.getter = this.parsePath(exprOrFn);
    }
    if (options) {
      this.lazy = !!options.lazy;
      this.user = !!options.user;
    } else {
      this.user = this.lazy = false;
    }
    this.dirty = this.lazy;
    this.cb = cb;
    this.options = options;
    this.id = uid++;
    this.deps = [];
    this.depsId = new Set();
    this.value = this.lazy ? undefined : this.get();
  }
  get() {
    const vm = this.vm;
    pushTarget(this);
    let value = this.getter.call(vm, vm);
    popTarget();
    return value;
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      this.run();
    }
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  depend() {
    for (let i = this.deps.length - 1; i >= 0; i--) {
      this.deps[i].depend();
    }
  }
  run() {
    const value = this.get();
    const oldValue = this.value;
    this.value = value;

    if (this.user) {
      try {
        this.cb.call(this.vm, value, oldValue);
      } catch (err) {
        console.error(err);
      }
    } else {
      this.cb.call(this.vm, value, oldValue);
    }
  }
  parsePath(path) {
    const segments = path.split('.');
    return function (obj) {
      for (let i = 0, len = segments.length; i < len; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }
      return obj;
    };
  }
}
