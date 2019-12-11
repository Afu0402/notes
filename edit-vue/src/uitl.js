
/**
 * 
 * env
 */
export function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

function cahed (fnc) {
  const cache = {};
  return function(str) {
    return cache[str] || cache[str] = fnc(str);
  }
}
export const camelize = cahed(function(str){
  return str.replace(/-(\w)/,(_,c) => )
})

/**
 * options
 */

 export function mergeOptions(parent,child,vm) {
    if(typeof child ==='function') {
      child = child.options
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm)

    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm)
      }
      if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm)
        }
      }
    }
    const options = {};
    let key;

    function mergeFied(key) {
      const strat = strats[key] || defaultStart
      options[key] = strat(parent[key],child[key],vm,key);
    }
    for(key in parent) {
      mergeFied(key)
    }

    for(key in child) {
      mergeFied(key)
    }
    
    return options;
 }
 function normalizeProps(options,vm) {
   const props = options.props;
   if(!props) return;

   const res = {};
   let i,val,name;
   if(Array.isArray(props)) {
     i = props.length;
     while(i--) {
       val = props[i];
        if(typeof val === 'string') {
          name = camelize(val);
        }
     }
   }
 }