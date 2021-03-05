


//call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
Function.prototype.$call = function (context) {
    context = context || global;
    context.fn = this;
    let args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
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
let person = {
    name:"Kobe"
}
function foo (a,c) {
    console.log(a);
    console.log(c);
    return('apply')
}
let res = foo.$apply(person,['Jordan','kobe'])
console.log(res);