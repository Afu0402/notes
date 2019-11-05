/**
 * 根据 then()传入的回调函数的返回值确定newPromise的状态和值
 * @param {*} newPromise 新的Promise
 * @param {*} x onResolve or onRjected的返回值，用来决定newPromise的值或者状态
 * @param {*} reject  newPromise的reject函数 用来改变状态并更新值
 * @param {*} resolve newPromise的resolve， 用来改变状态并更新值
 */
function resolvePromise(newPromise, x, resolve, reject) {
  let then;
  let isCalled = false;

  if (newPromise === x) {
    //对应标准2.3.1
    return reject(new TypeError("循环引用错误"));
  }
  if (x instanceof myPromise) {
    if (x.status === "pending") {
      //对应标准 2.3.2
      // 如果x的状态还没确定，就调用x.then方法接受x的值。别再次调用resolvePromise来决定newPromise的状态和值
      x.then(function(value) {
        resolvePromise(newPromise, value, resolve, reject);
      }, reject);
    } else {
      //如果x的状态是resolved,那就证明x的值是一个普通的值。直接调用newPromise的resolve设定newPromise 的新值
      x.then(resolve, reject);
    }
    return;
  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    //如果x是一个对象或者是一个函数
    try {
      // 如果调用then发生错误。在这之前没有重复调用resolvePromise或者rejectPromise。则reject
      then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          function (y) {
            if (isCalled) return; //防止重复调用
            isCalled = true;
            return resolvePromise(newPromise, y, resolve, reject);
          },
          function (r) {
            if (isCalled) return;
            isCalled = true;
            return reject(r);
          }
        );
      } else {
        resolve(x); //如果没有then函数证明该对象只是不是thenable类型的对象直接设置该值为newPromise的值。
      }
    } catch (error) {
      if (isCalled) return;
      isCalled = true;
      return reject(e);
    }
  } else {
    resolve(x); //如果只是普通值则直接设置为newPromise的值；
  }
}

function myPromise(executor) {
  let self = this;
  self.status = "pending";
  self.onResolvedCallback = [];
  self.onRejectedCallback = [];
  function resolve(value) {
    if (value instanceof myPromise) {
      return value.then(resolve, reject);
    }
    setTimeout(function() {
      if (self.status === "pending") {
        self.status = "resolved";
        self.data = value;
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value);
        }
      }
    }, 0);
  }

  function reject(reason) {
    setTimeout(function() {
      if (self.status === "pending") {
        self.status === "rejected";
        self.data = reason;
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason);
        }
      }
    });
  }
  try {
    // 考虑到执行executor的过程中有可能出错，所以我们用try/catch块给包起来，并且在出错后以catch到的值reject掉这个Promise
    executor(resolve, reject); // 执行executor
  } catch (e) {
    reject(e);
  }
}

myPromise.prototype.then = function(onResolved, onRejected) {
  let self = this;
  let newPromise;

  // 根据标准，如果then的参数不是function，则我们需要忽略它.并且默认返回当前的值作为新的promise的值
  onResolved =
    typeof onResolved === "function"
      ? onResolved
      : function(v) {
          return v;
        };
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : function(r) {
          throw r;
        };

  if (self.status === "resolved") {
    return (newPromise = new myPromise(function(resolve, reject) {
      setTimeout(function() {
        try {
          let x = onResolved(self.data);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(x);
        }
      }, 0);
    }));
  }

  if (self.status === "rejected") {
    return (newPromise = new myPromise(function(resolve, reject) {
      setTimeout(function() {
        try {
          let x = onRejected(self.data);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    }));
  }

  if (self.status === "pending") {
    return (newPromise = new myPromise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          let x = onResolved(value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
      self.onRejectedCallback.push(function(reson) {
        try {
          let x = onRejected(reson);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }
};

myPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

let a = new myPromise((resolve, reject) => {
  resolve(2);
}).then((res) => {
  return new myPromise((reslove,reject)=> {
    reslove(res * 2)
  })
});
a.then(res => {
  console.log(res)
})

console.log("主线程执行完毕");
