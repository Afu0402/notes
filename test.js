const series = function(arr) {
  const next  = (data) => {
    const fn = arr.shift();
    if(!fn) return;
    fn(next,data)
  }
  next();
}
let str = '';

series([
  function one(next){
    setTimeout(() => {
      str = 'Hello';
      next(str)
    },100)
  },
  function two(next,data){
    setTimeout(() => {
      str += 'Wrold';
      console.log(str)
      next()
    },100)
  }
])