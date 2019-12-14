

import {mergeOptions} from '../share/options'
import { initLifecycle, callHook } from './lifecycle'
import {initEvents} from './events'
import {initRender} from './render'
import {initState} from './state'
let uid = 0;
export function initMixin(Vue) {
  /**
   * _init
   * 初始化方法。在new Vue的时候调用。主要做一些初始化工作。
   */
  Vue.prototype._init = function(options) {
    const vm = this;
    vm._uid = uid++;
    vm._isVue = true;
    
    //合并选项
    vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor),options||{},vm);

    vm.self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm)// 未知
    callHook(vm, 'beforeCreate');
    initState(vm)
  }
}


export function resolveConstructorOptions(Ctro) {
  
  /**
   * 获取构造函数上的选项
   * @Options 在src/global-api/initGlobalAPI上被定义
   */
  const options = Ctro.options;
  return options;
}