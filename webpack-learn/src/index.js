
import './index.css';
import {print} from './print';

console.log(process.env.NODE_ENV)

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');
  const ipt = document.createElement('input');

  element.innerHTML = 'hello webpack'

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = print;

  element.appendChild(btn);
  element.appendChild(ipt)
  return element;
}

document.body.appendChild(component());
if (module.hot) {
    module.hot.accept('./print.js', function() {
     console.log('Accepting the updated printMe module!');
     printMe();
    })
 }