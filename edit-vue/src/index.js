import Vue from './instance/index';
import {initGlobalAPI} from './global-api/index'
initGlobalAPI(Vue);
let vm = new Vue({
  el:'#div',
  props:['name'],
  data:{
    name:"1"
  }
})
console.log(vm)