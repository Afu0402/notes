
const _toString = Object.prototype.toString
export const emptyObject = Object.freeze({});
/**
 * util
 */

export function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  let res
  try {
    res = args ? handler.apply(context, args) : handler.call(context)
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(e => handleError(e, vm, info + ` (Promise/async)`))
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true
    }
  } catch (e) {
    console.warn(`24 cloumn:  ${e} info:${info}`)
  }
  return res
}

export function isUndef () {
  return v === undefined || v === null
}

/**
 * Check if value is primitive.
 */
export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
export function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj,key) {
  return hasOwnProperty.call(obj, key)
}

export function isValidArrayIndex(val) {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}
/**
 * env
 */
export function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

function cahed (fnc) {
  const cache = {};
  return function(str) {
    return cache[str] || (cache[str] = fnc(str));
  }
}
export const camelize = cahed(function(str){
  return str.replace(/-(\w)/,(_,c) => c.toUpperCase())
})

/**
 * options
 */

 