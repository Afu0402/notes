/**
 *  链式队列
 */

 class Node {
   constructor(value) {
     this.value = value;
     this.next = null;
   }
 }

 class List {
   constructor() {
     this.node = null;
     this.tail = null;
     this.head = null;
   }

   enqueue(value){
    const newNode = new Node(value);
    if(this.tail === null) {
      this.tail = newNode;
      this.head = newNode;
      return true;
    }
    this.tail.next = newNode;
    this.tail = newNode;
   }

   dequeue(){
     if(this.head === null) {
       return false;
     };
     const deItem = this.head;
     if(deItem === this.tail) {
       this.tail = null
     }
     this.head = this.head.next;
     return deItem;
   }
}
const list = new List();
list.enqueue('a');
list.enqueue('b');
list.enqueue('c');
console.log('------------------');
console.log(list.dequeue())
console.log(list.dequeue())
console.log(list.dequeue())

list.enqueue('1');
list.enqueue('2');
list.enqueue('3');
console.log(list.head)