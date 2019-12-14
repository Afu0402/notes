
const _toString = Object.prototype.toString

export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

export const emptyObject = Object.freeze({});

export const no = (a, b, c) => false;
export const identity = (_) => _;
export function noop (a,b,c) {}
export function def(obj,key,val,enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
/**
 * Parse simple path.
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
/**
 * util
 */

// export function handleError (err: Error, vm: any, info: string) {
//   pushTarget()
//   try {
//     if (vm) {
//       let cur = vm
//       while ((cur = cur.$parent)) {
//         const hooks = cur.$options.errorCaptured
//         if (hooks) {
//           for (let i = 0; i < hooks.length; i++) {
//             try {
//               const capture = hooks[i].call(cur, err, vm, info) === false
//               if (capture) return
//             } catch (e) {
//               globalHandleError(e, cur, 'errorCaptured hook')
//             }
//           }
//         }
//       }
//     }
//     globalHandleError(err, vm, info)
//   } finally {
//     popTarget()
//   }
// }

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

 