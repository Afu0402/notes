import test from './test.js';
test(1,4,5);
let a = () => 1;
let b = new  Promise((resolve) => {
  resolve(1)
}).then(res => {
  console.log(res)
  return res;
})
console.log([12,23].includes(23))
class person {
  constructor(name){
    this.name = name;
  }
}

let c  = new person('kek')
console.log(c)
console.log(b)