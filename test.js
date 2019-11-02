promise.prototype.then = function(onResolved, onRejected) {
  /**
   * then用来注册在promise状态改变后执行相应的回调函数。
   * 在Promise/A+的标准中要求then要求返回一个全新的对象。且该对象的值取传入then的回调函数的返回值。
   * 如果then注册的回调函数返回一个Promise，则该对象的状态和值直接取该Promise的状态和值；
   *
   */
  const self = this;
  console.log(self);
  let newPromise;
  // 如果传入的参数不是函数则忽略；
  onResolved =
    Object.prototype.toString.call(onResolved) === "[object Function]"
      ? onResolved
      : function(v) {};
  onRejected =
    Object.prototype.toString.call(onRejected) === "[object Function]"
      ? onRejected
      : function(r) {};

  if (self.status === "resolved") {
    // 如果此时的promise状态已经被resolved,调用onResolved。如果在onResolved出错应该通过reject抛出
    return (newPromise = new promise(function(resolve, reject) {
      try {
        let result = onResolved(self.data);
        if (result instanceof promise) {
          //  如果onResolved的返回值是一个Promise对象，直接取它的结果做为newPromise的结果
          result.then(resolve, reject);
        }
        resolve(result);
      } catch (e) {
        reject(result);
      }
    }));
  }
  if (self.status === "rejected") {
    return (promise2 = new promise(function(resolve, reject) {
      try {
        let result = onRejected(self.data);
        if (result instanceof promise) {
          result.then(resolve, reject);
        }
        resolve(result);
      } catch (e) {
        reject(result);
      }
    }));
  }

  if (self.status === "pending") {
    /**
     * 如果当前的promise处于Pendding状态，既我们并不知道此时应该调用onResolved or onRejected,
     * 只能等到Promise状态确定后才能做处理，所以应该把2个回调函数放入 当前promise的 回调数组里。以便当状态改变的时候做相应的处理
     */
    return (promise2 = new promise(function(resolve, reject) {
      self.onResovleCallback.push(function(value) {
        try {
          let result = onResolved(self.data);
          if (result instanceof promise) {
            //  如果onResolved的返回值是一个Promise对象，直接取它的结果做为newPromise的结果
            result.then(resolve, reject);
          }
          resolve(result);
        } catch (e) {
          reject(result);
        }
      });
    }));
  }
};
function promise(executor) {
  const self = this;
  self.status = "pending";
  self.data = undefined;
  self.onResovleCallback = [];
  self.onRejectCallback = [];
  function resolve(value) {
    if (self.status === "pending") {
      self.status = "resolved";
      self.data = value;
      setTimeout(() => {
        self.onResovleCallback.forEach(item => item(value));
      }, 0);
    }
  }

  function reject(reason) {
    if (self.status === "pending") {
      self.status = "rejected";
      self.data = reason;
      setTimeout(() => {
        self.onRejectCallback.forEach(item => item(reason));
      }, 0);
    }
  }
  if (Object.prototype.toString.call(executor) === "[object Function]") {
    executor(resolve, reject);
  }
}

let a = new promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then(res => {
    console.log(12);
    console.log(res);
    return res;
  })
  .then(res => {
    console.log(res);
  });
// debugger
