const obj = {
  name: 'test',
  age: 18,
  address: 'beijing',
};

obj[Symbol.iterator] = function () {
  let index = 0;
  const keys = Object.keys(this);
  return {
    next() {
      if (index < keys.length) {
        return {
          value: keys[index++],
          done: false,
        };
      } else {
        return {
          value: undefined,
          done: true,
        };
      }
    },
  };
};

for (let item of obj) {
  console.log(item);
}