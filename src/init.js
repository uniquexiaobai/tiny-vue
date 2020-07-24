import Watcher from './watcher';
import { initState, initComputed, initWatch } from './state';

export function initMixin(TinyVue) {
  TinyVue.prototype.$mount = function () {
    const vm = this;
    new Watcher(vm, vm.$options.render, () => {}, true);
  };

  TinyVue.prototype._init = function (options) {
    const vm = this;
    this.$options = options;
    if (options.data) {
      initState(vm);
    }
    if (options.computed) {
      initComputed(vm);
    }
    if (options.watch) {
      initWatch(vm);
    }
  };
}
