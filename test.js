let a = 'a-ba';
a.replace(/-(\w)(\w)/g,(_,c,b) => {
  console.log(_)
  console.log(c)
  console.log('-----')
})