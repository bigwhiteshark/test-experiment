const test = {
  name: 'test',
  age: 18,
  address: 'beijing',
};

// 代理
const proxy = new Proxy(test, {
  get(target, key, receiver) {
    if (key in target) {
      return target[key]; // 从原型链上查找 key 属性
    } else {
      throw new ReferenceError('Prop name "' + key + '" does not exist.');
    }
  },
  set(target, key, value, receiver) {
    if (key in target) {
      target[key] = value;
    } else {
      throw new ReferenceError('Prop name "' + key + '" does not exist.');
    }
  },
});
console.log(proxy.name, proxy.xx);
