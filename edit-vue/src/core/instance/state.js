
import {defineReactive,} from '../observer/index'
import {noop,hasOwn,isPlainObject } from '../share/uitl'
import {toggleObserving,observe} from '../observer/index'
import {pushTarget,popTarget} from '../observer/dep'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
export function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function initMethods (vm, methods) {
  const props = vm.$options.props
  for (const key in methods) {
      if (typeof methods[key] !== 'function') {
        console.warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`
        )
      }
      if (props && hasOwn(props, key)) {
        console.warn(
          `Method "${key}" has already been defined as a prop.`
        )
      }
    vm[key] = typeof methods[key] !== 'function' ? noop : methods[key].bind(vm);
  }
}

export function initState (vm) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props) //校验Props
  if (opts.methods) initMethods(vm, opts.methods) //校验methods
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // if (opts.computed) initComputed(vm, opts.computed)
  // if (opts.watch && opts.watch !== nativeWatch) {
  //   initWatch(vm, opts.watch)
  // }
}

function initProps (vm, propsOptions) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    // const value = validateProp(key, propsOptions, propsData, vm)
    const value = propsOptions[key];
    /* istanbul ignore else */
    defineReactive(props, key, value)

    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}

export function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    throw `${e}, ${vm}, data()`
  } finally {
    popTarget()
  }
}
function initData (vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    console.warn('data functions should return an object')
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
      if (methods && hasOwn(methods, key)) {
        throw  `Method "${key}" has already been defined as a data property.`
      }
    if (props && hasOwn(props, key)) {
      throw `The data property "${key}" is already declared as a prop. Use prop default value instead`;
    } else {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}