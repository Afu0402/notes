import { isPlainObject, isNative, camelize,hasOwnProperty } from "./uitl";
import {LIFECYCLE_HOOKS,ASSET_TYPES } from './constants'
import { set } from '../observer/index'

// 合并选项的策略对象；
const strats = {};


/**
 * props,methods,computed都是一样的合并逻辑。都是简单的对象；
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal) {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}

/**
 * 合并生命周期钩子
 * 
 *  
 * */ 
function mergeHook (parentVal,childVal){
  //返回的每个生命周期选项都会在一个数组内；
  const res = childVal ? parentVal? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal :[childVal]: parentVal;
  return res ? dedupeHooks(res) : res
}
function dedupeHooks (hooks) {
  //去除重复的生命周期钩子
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}
// 循环把每个生命周期的策略方法赋值到strats上；
LIFECYCLE_HOOKS.forEach(hook => strats[hook] = mergeHook);


// 合并 components,fitlers,directives
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  const res = Object.create(parentVal || null)
  if (childVal) {
    assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})



/**
 * 默认的合并策略
 * 
 */
const defaultStrat = function(parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * 合并data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // 在组件上的data必须是一个返回数据对象的函数；
    if (childVal && typeof childVal !== 'function') {
      console.warn('The "data" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.')
      return parentValt
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}

export function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {

  /**
   * 此函数回返回要给函数，会根据是否传入vm(也就是是否是根实例的调用还是注册组件的方式调用)返回的函数会在后面初始化数据的时候被调用求求值。
   */
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
        console.log(instanceData)
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

function mergeData(to, from) {
  if (!from) return to;
  let key, toVal, formVal;
  const keys = Object.keys(form);
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    if (key === "__ob__") continue;
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}




/**
 * 
 * @param {*} parent 父选项（也有可能是构造函数上的options);
 * @param {*} child 子选项
 * @param {*} vm vue实例。可选
 */
export function mergeOptions(parent, child, vm) {
  if (typeof child === "function") {
    child = child.options;
  }

  //统一props选项；
  normalizeProps(child, vm);
  //统一inject选项；
  normalizeInject(child, vm);

  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }

    // 合并mixins选项。混入功能
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }
  const options = {};
  let key;

  function mergeFied(key) {
    // 根据传入的选项key选择不同的合并策略；
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  for (key in parent) {
    mergeFied(key);
  }

  for (key in child) {
    mergeFied(key);
  }

  return options;
}
function normalizeProps(options, vm) {
  const props = options.props;
  if (!props) return;

  const res = {};
  let i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === "string") {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        throw "props must be strings when using array syntax";
      }
    }
  } else if (isPlainObject(props)) {
    for (let key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  } else {
    throw "Invalid value for option props: expected an array or an object";
  }
  options.props = res;
}

function normalizeInject(options, vm) {
  const inject = options.inject;
  if (!inject) return;
  const normalized = (options.inject = {});
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    throw `Invalid value for option "inject": expected an Array or an Object`;
  }
}

function assertObjectType (name,value,vm) {
  if (!isPlainObject(value)) {
    console.warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`
    )
  }
}
