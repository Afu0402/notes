import _ from 'lodash';
import print from './print'
function component() {
  console.log(
    _.join(['Another', 'module', 'loaded!'], ' ')
  );
  const element = document.createElement('div');
  const btn = document.createElement('button');
  const ipt = document.createElement('input');

  btn.innerHTML = 'Click me and check the alert--';
  btn.onclick = print;
  
  element.innerHTML = 'hello webpack'
  element.appendChild(btn);
  element.appendChild(ipt);
  return element;
}

document.body.appendChild(component());