const obj = {};

Object.defineProperty(obj, 'address', {
  value: 'beijing',
  writable: false,
  enumerable: false,
  configurable: false,
});

const p = new Proxy(obj, {
  get(target, key, receiver) {
    return 'abc';
  },
  set(target, key, value, receiver) {
    if (key in target) {
      target[key] = value;
    } else {
      throw new ReferenceError('Prop name "' + key + '" does not exist.');
    }
  },
});
console.log(p.address);
