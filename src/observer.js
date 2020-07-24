import Dep from './dep';

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'sort',
  'reverse',
];

methods.forEach(method => {
  const origin = arrayProto[method];
  def(arrayMethods, method, function (...args) {
    const result = origin.apply(this, args);
    const ob = this.__ob__;
    let inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted) ob.observeArray(args);
    ob.dep.notify();
    return result;
  });
});

function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export default class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();

    def(value, '__ob__', this);

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.wark(value);
    }
  }
  wark(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(array) {
    array.forEach(val => {
      observe(val);
    });
  }
}

export function observe(data) {
  if (typeof data !== 'object' && data != null) return;

  let ob;
  if (
    Object.hasOwnProperty(data, '__ob__') &&
    data.__ob__ instanceof Observer
  ) {
    ob = data.__ob__;
  } else {
    ob = new Observer(data);
  }
  return ob;
}

export function defineReactive(data, key, value) {
  let dep = new Dep();
  let childOb = observe(value);

  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue === value || (newValue !== newValue && value !== value)) {
        return;
      }
      observe(newValue);
      value = newValue;
      dep.notify();
    },
  });
}

function dependArray(array) {
  array.forEach(value => {
    value && value.__ob__ && value.__ob__.dep.depend();
    if (Array.isArray(value)) {
      dependArray(value);
    }
  });
}
