
import {initMixin} from './init.js'
function Vue (options){
  if(! (this instanceof Vue)) {
     throw 'Vue is a constructor and should be called with new keyword';
  }
  this._init(options)
}

// 初始化选项
initMixin(Vue);

export default Vue;