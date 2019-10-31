
import tool from './async/tool'
import tool2 from './async/tool2'
import tool3 from './async/tool3'
import big from './async/big'
big();
export default function printMe() {
  tool();
  tool2();
  tool3();
  console.log('I get called from print.js!');
}