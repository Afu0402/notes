 function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}


/**
 * env
 */
 function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

function cahed (fnc) {
  const cache = {};
  return function(str) {
    return cache[str] || (cache[str] = fnc(str));
  }
}
 const camelize = cahed(function(str){
  return str.replace(/-(\w)/,(_,c) => c.toUpperCase())
})

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
         res[name] = {type:null}
       } else {
         throw 'props must be strings when using array syntax'
       }
    }
  } else if(isPlainObject(props)) {
    for(let key in props) {
       val = props[key];
       name = camelize(key);
       res[name] = isPlainObject(val) ? val : {type:val};
    }
  } else {
    throw 'Invalid value for option props: expected an array or an object'
  }
  options.props = res;
}
let options = {
  props:{
    'ke-fuqian':String
  }
}
normalizeProps(options)
console.log(options)
debugger