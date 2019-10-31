
import tool from './common/tool'
import tool2 from './common/tool2'
import tool3 from './common/tool3'
export default function printMe() {
  tool();
  tool3();
  tool2();
  console.log('I get called from print2.js!');
}