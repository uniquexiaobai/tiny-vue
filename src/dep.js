let uid = 0;

export default class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    this.subs.slice().forEach(watcher => watcher.update());
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }
}

Dep.target = null;
const targetStack = [];

export function pushTarget(watcher) {
  Dep.target = watcher;
  targetStack.push(watcher);
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
