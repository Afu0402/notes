


promise.prototype.resolve = function(value) {
  this.status = 'fulfilled';
  this.data= value;
  setTimeout(() => {
    this.onResovleCallback.forEach(item => item(this.data))
  },0)
}
promise.prototype.reject = function(error) {
  this.status = 'rejected';
  this.data= error;
  setTimeout(() => {
    this.onRejectCallback.forEach(item => item(this.data))
  },0)
}

promise.prototype.then = function(onFulfilled,onRejected) {
  if(Object.prototype.toString.call(onFulfilled) === '[object Function]') {
    this.onResovleCallback.push(onFulfilled)
  }
  if(Object.prototype.toString.call(onRejected) === '[object Function]') {
    this.onRejectCallback.push(onRejected)
  }
  let newPromise = new promise();
  
  newPromise.status = this.status;
  return newPromise
}
function promise(executor) {
  const self = this;
  self.status = 'pending';
  self.data = undefined;
  self.onResovleCallback = [];
  self.onRejectCallback = [];
  if(Object.prototype.toString.call(executor) === '[object Function]') {
    executor(self.resolve.bind(self),self.reject.bind(self));
  }
}

let a = new promise((resolve,reject) => {
  setTimeout(() => {
    resolve(1)
  },1000)
}).then(res => {
  console.log(res);
})