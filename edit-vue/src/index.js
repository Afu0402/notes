import Vue from './core/index.js'
let vm = new Vue({
  el:'#div',
  beforeCreate(){
    console.log('12')
  },
  created() {
    console.log('create')
  },
  props:['name'],
  data:{
    age:"1"
  }
})
console.log(vm)