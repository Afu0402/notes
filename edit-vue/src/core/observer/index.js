import {isValidArrayIndex,isPrimitive,isUndef} from '../share/uitl'
import Dep from './dep'
import {isPlainObject,hasOwn,def} from '../share/uitl'

export let shouldObserve = true

export function toggleObserving (value) {
  shouldObserve = value
}
export function observe(value,asRootData) {
  if(!isPlainObject(value)) {
    return
  }
  let ob;
  if(hasOwn(value,'__ob__')) {
    ob = value.__ob__
  } else  {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value,'__ob__',this)
    this.walk(value);
  }
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
export function set (target, key, val) {
  if (isUndef(target) || isPrimitive(target)) {
    throw `Cannot set reactive property on undefined, null, or primitive value`
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    console.warn('Avoid adding reactive properties to a Vue instance or its root $data ');
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  // defineReactive(ob.value, key, val)
  // ob.dep.notify()
  return val
}

/**
 * Define a reactive property on an Object.
 * 代理属性的拦截行为。
 */
export function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {

  // 每个属性的get set 都持有一个属于自己的Dep;
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}