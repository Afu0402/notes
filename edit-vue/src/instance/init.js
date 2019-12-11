

let uid = 0;
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm._uid = uid++;
    vm._isVue = true;

    vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor),options||{},vm);

    vm.self = vm;
    
  }
}


export function resolveConstructorOptions(Ctro) {
  const options = Ctro.options;
  return options;
}