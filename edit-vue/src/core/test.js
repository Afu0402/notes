 function parsePath (path) {
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
let data = {
  a:{
    b:{
      name:'afu'
    }
  }
}

let resolve = parsePath('a.b.name');
console.log(resolve(data))
