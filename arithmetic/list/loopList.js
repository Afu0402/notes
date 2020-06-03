
/**
 * 循环队列，
 * 为了避免 “假溢出”现象，主要是更合理的利用储存空间。可以知道队列的head是否有空间从而循环利用已经出队后空出来的空间。
 * 通过 （tail+1)% Array.length === head 来判断是否队列已满；
 * 通过 head === tail 判断队空；
 * 
 */
class LoopList {
  constructor(num = 8) {
    const arr = []
    for(let i = 0; i< num; i++) {
      arr.push('')
    }
    this.items = arr;
    this.head = 0;
    this.tail = 0;
    this.length = num;
  }

  enqueue(value){
    if((this.tail + 1)% this.length === this.head) {
      console.log('队列已满')
      return false
    }
    this.items[this.tail] = value;
    this.tail = (this.tail+1)%this.length;
  }

  dequeue(){
    if(this.head === this.tail) {
      console.log('无任何元素')
      return false
    }
    const item = this.items[this.head];
    this.items[this.head] = '';
    this.head = (this.head+1)%this.length;
    return item;
  }
}
const loopList = new LoopList();
loopList.enqueue('a');
loopList.enqueue('b');
loopList.enqueue('c');
loopList.enqueue('d');
loopList.enqueue('e');
loopList.enqueue('f');
loopList.enqueue('g');
console.log(loopList.dequeue())
console.log(loopList.dequeue())
console.log(loopList.dequeue())
console.log(loopList.dequeue())
console.log(loopList.dequeue())
loopList.enqueue('1');
loopList.enqueue('1');
loopList.enqueue('1');
loopList.enqueue('1');
loopList.enqueue('1');

console.log(loopList.items)