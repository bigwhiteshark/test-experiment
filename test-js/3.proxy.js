const target = {
  name: 'test',
  age: 18,
  address: 'beijing',
};
const handler = {
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
};

/*const proxy = new Proxy(target, handler);
console.log(proxy.name);*/
const { proxy, revoke } = Proxy.revocable(target, handler);
console.log(proxy.address);
revoke();
console.log(proxy.address);
