function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

console.log(extend({name:"kefuqian"},{name:"long"}))