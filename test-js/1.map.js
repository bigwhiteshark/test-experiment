const obj = {
  name: 'test',
  age: 18,
  address: 'beijing',
};

const map = new Map();
map.set('name', 'test');
map.set('age', 18);
map.set('address', 'beijing');
map.set(obj, 'myobj');

/* for (let item of map) {
  console.log(item);
} */

/* const keys = map.keys();
for (let item of keys) {
  console.log(item);
}
const values = map.values();
for (let item of values) {
  console.log(item);
}
const entries = map.entries();
for (let item of entries) {
  console.log(item);
}
 */

map.forEach((value, key) => {
  console.log(key, value);
});
