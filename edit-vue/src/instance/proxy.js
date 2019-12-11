

let initProxy;
import {isNative} from '../uitl';


const hasHandler = {
  has (target, key) {
    const has = key in target
    const isAllowed = allowedGlobals(key) ||
      (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
    if (!has && !isAllowed) {
      if (key in target.$data) warnReservedPrefix(target, key)
      else warnNonPresent(target, key)
    }
    return has || !isAllowed
  }
}

const getHandler = {
  get (target, key) {
    if (typeof key === 'string' && !(key in target)) {
      if (key in target.$data){
        warnReservedPrefix(target, key)
        throw `Property "${key}" must be accessed with "$data.${key}`;
      } else {
         throw `Property or method "${key}" is not defined on the instance but 'referenced during render. Make sure that this property is reactive,`
      } 
    }
    return target[key]
  }
}
const hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy)
initProxy = function initProxy (vm) {
  if (hasProxy) {
    const options = vm.$options
    const handlers = getHandler;
    vm._renderProxy = new Proxy(vm, handlers)
  } else {
    vm._renderProxy = vm
  }
}