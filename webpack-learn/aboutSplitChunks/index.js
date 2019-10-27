import _ from 'lodash';
import jsl from './jsl';
jsl();
function component() {
  console.log(
    _.join(['Another', 'module', 'loaded!'], ' ')
  );
  const element = document.createElement('div');
  const btn = document.createElement('button');
  const ipt = document.createElement('input');

  btn.innerHTML = 'Click me and check the alert--';
  import(/* webpackChunkName: "printAsync" */'./print').then(({default:print}) => {
    btn.onclick = print;
  })

  // import(/* webpackChunkName: "print2" */'./print2').then(({default:print}) => {
  //   print();
  // })

  // import(/* webpackChunkName: "print3" */'./print3').then(({default:print}) => {
  //   print();
  // })
  
  element.innerHTML = 'hello webpack'
  element.appendChild(btn);
  element.appendChild(ipt);
  return element;
}

document.body.appendChild(component());