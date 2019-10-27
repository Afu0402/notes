import module2 from './module2';
import module1 from './module1';
function component() {
  module2();
  module1();

  const element = document.createElement('div');
  const btn = document.createElement('button');
  const ipt = document.createElement('input');
//  import(/* webpackChunkName: "long" */  './long').then( res=> {
//   res.default();
//  })
//  import(/* webpackChunkName: "test" */  './test').then( res=> {
//   res.default();
//  })
  btn.innerHTML = 'Click me and check the alert--';
  
  element.innerHTML = 'hello webpack'
  element.appendChild(btn);
  element.appendChild(ipt);
  haha();
  print();

  return element;
  // test();
  // return import(/* webpackChunkName: "lodash" */ 'lodash').then(data => {
  //   const _ = data.default;
  //   const element = document.createElement('dd');
  //   element.innerHTML = _.join(['hello','webpack!!']);

  //   return element
  // })
}
document.body.appendChild(component());

// component().then(ele => {
// document.body.appendChild(ele);
// })