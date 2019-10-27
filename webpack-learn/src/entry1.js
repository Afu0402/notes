function component() {
  import(/* webpackChunkName: "asyncModule" */ "./async-module").then(res => {
    res.default();
  });

  const element = document.createElement("div");
  const btn = document.createElement("button");
  const ipt = document.createElement("input");

  //  import(/* webpackChunkName: "test" */  './test').then( res=> {
  //   res.default();
  //  })
  btn.innerHTML = "Click me and check the alert--";

  element.innerHTML = "hello webpack";
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
