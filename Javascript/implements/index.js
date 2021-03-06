


//call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
Function.prototype.$call = function (context) {
    context = context || global;
    context.fn = this;
    let args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    //利用eval执行js函数代码
    let res = eval('context.fn(' + args + ')');
    delete context.fn;
    return res;
}

// let person = {
//     name:"Kobe"
// }
// function foo (c) {
//     console.log(this.name);
//     console.log(c);
//     return('call')
// }
// let res = foo.$call(person,'Jordan')
// console.log(res);


// 和call方法相同，只不过是参数变成数组；
Function.prototype.$apply = function (context,rest) {
    context = context || global;
    context.fn = this;
    let args = [];
    for (let i = 0; i < rest.length; i++) {
        args.push('rest[' + i + ']');
    }
    let res = eval('context.fn(' + args + ')');
    delete context.fn;
    return res;
}
Function.prototype.$bind = function (context) {
    let self = this;
    let args = Array.prototype.slice.call(arguments,1);
    function EmptyFn () {}
    function bindFn() {
        //判断是否当作构造函数使用，如果是则直接使用 this(生成的实例对象)作为该函数调用的this,否则使用传入的参数作为this;
        context = this instanceof bindFn ? this : context;

        //合并2个函数的参数；
        args = args.concat(Array.prototype.slice.call(arguments))
        return self.apply(context,args)
    }
    //拿一个空函数作为中转，避免如果改变bind函数的原型，也会直接改变原函数的原型；
    EmptyFn.prototype = this.prototype;
    bindFn.prototype = new EmptyFn();
    bindFn.prototype.constructor = bindFn;
    return bindFn;
}
// let person = function (name,age) {
//     this.name = name;
//     this.age = age;
// }
// let person2 = person.$bind(null,'afu');
// person2.prototype.sex = 'man';
// console.log(person2.prototype)
// let afu = new person2(19);
// console.log(afu instanceof person);


//模拟new 关键字的实现
const ObjectFactory = function (fn) {
    //创建一个新对象且该对象原型为 fn.prototype;
    const obj = Object.create(fn.prototype);
    //收集初始化对象的参数；
    const args = Array.prototype.slice.call(arguments,1);
    //调用构造函数并传入obj作为其内部的this值
    const res = fn.apply(obj,args);

    //根据new关键字的特性。如果构造函数内显示的返回一个值。如果该值为一个对象则直接使用该对象，反之则使用创建的新对象作为其返回值
    return typeof res === 'object' ? res : obj;
}
const Animal = function (type) {
    this.type = type;
}
Animal.prototype.getType = function () {
    return this.type;
}
// let cat = new Animal('cat');
let cat = ObjectFactory(Animal,'cat');
console.log(cat.getType());
console.log(cat)

