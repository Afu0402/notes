function toString(obj) {
  const str = Object.prototype.toString.call(obj);
  return str.substring(8, str.length - 1);
}

function copyDeep(obj) {
  let copyed = [];
  // 储存已经copy的对象,和原对象;
  function _copyDeep(obj) {
    if (typeof obj !== "object" || !obj) {
      return obj;
    }

    for (let i = 0; i < copyed.length; i++) {
      // 判断是否出现自引用的. 如果有则返回已经copy的对象,防止出现自循环引用
      if (copyed[i].target === obj) {
        return copyed[i].copyTarget;
      }
    }
    let temObj = {};
    if (toString(obj) === "Array") {
      temObj = [];
    }

    copyed.push({
      target:obj,
      copyTarget:temObj
    })

    if (toString(obj) === "Date") {
      temObj = new Date(obj);
    } else {
      const keys = Object.keys(obj);
      keys.forEach(key => {
        temObj[key] = _copyDeep(obj[key]);
      });
    }
    return temObj;
  }
  return _copyDeep(obj);
}
//the original object
let a = {
  name: "a",
  arr: [1, 2, { age: 12 }, { arr: [1, 2, 3] }],
  date: new Date(),
  fn: function() {
    console.log("afn");
  }
};
a.self = a;

// copydeep object;
let b = copyDeep(a);

b.name = "b";
b.arr[0] = "change";
b.arr[2].age = "change13";
b.arr[3].name = "insertarr";
b.date = "12:00";
b.fn = function (){
  console.log('bfn')
}

console.log(a);
console.log("更改后的对象a 和b-----------------------------------------");
console.log(b);
a.fn();
b.fn();
debugger