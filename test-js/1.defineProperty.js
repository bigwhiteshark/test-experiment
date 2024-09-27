function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function defineGet() {
      console.log(`get key: ${key} val: ${val}`);
      return val;
    },
    set: function defineSet(newVal) {
      console.log(`set key: ${key} val: ${newVal}`);
      val = newVal;
    },
  });
}

function observe(data) {
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}

let test = [1, 2, 3];

observe(test);

test[0] = 4; // set key: 0 val: 4
test[3] = 5;

let arr = [1, 2, 3, 4, 1, 2, 3];
let set = new Set(arr);
console.log(set);

let a = new Set([1, 2, 3]);
let b = new Set([3, 4, 2]);

let c = [...new Set([...a, ...b])];
console.log(c);

let intersect = new Set([...a].filter((x) => b.has(x)));
console.log(intersect);
let union = new Set([...a, ...b]);
console.log(union);

let diff = new Set([...a].filter((x) => !b.has(x)));
console.log(diff);


