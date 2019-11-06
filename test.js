function toString(obj){
  const str = Object.prototype.toString.call(obj);
  return str.substring(8,str.length - 1);
}

function copyDeep (obj){
  let temObj;

  if(typeof obj !== 'object') {
    return obj
  }
  if(toString(obj) === 'Object') {
    temObj = {};
    const keys = Object.keys(obj);
    keys.forEach(key => {
      temObj[key] = copyDeep(obj[key]);
    })
  }

  if(toString(obj) === 'Array') {
    temObj = [];
    obj.forEach(item => {
      temObj.push(copyDeep(item))
    })
  }

  if(toString(obj) ==='Date') {
    temObj = new Date(obj);
  }
  return temObj;
}
//the original object
let a = {
  name:"a",
  arr: [1,2,{age:12},{arr:[1,2,3]}],
  date: new Date(),
  fn:function(){
    console.log('fn')
  }
}

// copydeep object;
let b = copyDeep(a)

b.name = 'b'
b.arr[0] = 'change';
b.arr[2].age = 'change13';
b.arr[3].name = 'insertarr'
b.date = '12:00';

console.log(a)
console.log('更改后的对象a 和b-----------------------------------------')
console.log(b)
b.fn()
