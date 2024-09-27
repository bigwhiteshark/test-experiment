function TestPromise(executor) {
  let self = this;
  this.status = 'pending';
  this.data = undefined;
  this.callbacks = []  // 每个元素的结构：{onResolved(){}，onRejected(){}}

  function resolve(value) {
    // 将状态改为resolved
    self.status = 'resolved'
    // 保存value的值
    self.data = value

    // 如果有待执行的callback函数，立即异步执行回调函数onResolved
    if (self.callbacks.length > 0) {
      self.callbacks.forEach(callbackObj => {
        callbackObj.onResolved(value)
      })
    }
  }

  function reject() {

  }

  // 立即同步执行executor
  executor(resolve, reject)

}

TestPromise.prototype.resolve = function (onResolved, onRejected) {

}

TestPromise.prototype.reject = function (onResolved, onRejected) {

}

TestPromise.prototype.then = function (onResolved, onRejected) {
  if (this.status === 'pending') {
    // promise当前状态还是pending状态，将回调函数保存起来
    this.callbacks.push({
      onResolved() { onResolved(this.data) },
      onRejected() { onRejected(this.data) }
    })
  } else if (this.status === 'resolved') {
    onResolved(this.data)
  } else {
  }
}

TestPromise.prototype.catch = function (onRejected) {

}

TestPromise.resolve = function (value) {

}

TestPromise.reject = function (value) {

}

TestPromise.all = function (promises) {

}

TestPromise.race = function (promises) {

}

const p = new TestPromise(function (resolve, reject) {
  resolve(1)
})

p.then(
  value => { console.log('value', value) },
  err => { console.log(err) }
)