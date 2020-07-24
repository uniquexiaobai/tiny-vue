import { initMixin } from './init';

function TinyVue(options) {
  this._init(options);
  this.$mount();
}

initMixin(TinyVue);

const root = document.querySelector('#root');

let vm = new TinyVue({
  data() {
    return {
      count: 0,
      nums: [0],
    };
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  watch: {
    count(newValue, oldValue) {
      console.log('count changed', newValue, oldValue);
    },
  },
  render() {
    root.innerHTML = `
      <div>
        <h1 style="color: red">count: ${this.count}, doubleCount: ${this.doubleCount}</h1>
        <h1>${this.nums.join('-')}</h1>
        <button onclick="increment()">+</button>
      </div>
    `;
  },
});

console.log('vm', vm);

window.increment = () => {
  vm.count += 1;
  vm.nums.push(vm.count);
};
