class Node {
  constructor(element) {
    this.element = element,
    this.next = null;
  }
}
class SinglyLinkedList {
  constructor(){
    this.head = new Node('head');
  }
  append(ele){
    /**
     * 插入元素到最后一个节点
     */
    let currentNode = this.head;
    while(currentNode.next) {
      currentNode = currentNode.next;
    }
    const newNode = new Node(ele);
    currentNode.next = newNode;
  }
  
  findByValue(ele) {
    /**
     * 通过元素的值查找元素，如果没有则返回-1
     */
    let currentNode = this.head;
    while(currentNode !== null && currentNode.element !== ele) {
      currentNode = currentNode.next;
    }
    return currentNode === null ? -1 : currentNode;
  }

  findByIndex(index) {
    /**
     * 通过元素的位置查找元素，如果没有则返回-1
     * 默认从0开始；
     */
    let currentNode = this.head.next;
    let pos = 0;
    while(currentNode !== null && pos !== index) {
      currentNode = currentNode.next;
      pos++;
    }
    return currentNode === null ? -1 : currentNode;
  }

  findPrev(ele) {
    /** 
     * 找到出入元素的上一个元素，通过对比next === ele,来确定currentNode是不是该元素的上一个
    */
    let currentNode = this.head;
    while(currentNode.next !== null && currentNode.next.element !== ele) {
      currentNode = currentNode.next;
    }
    if(currentNode.next === null) {
      return - 1;
    }

    return currentNode;
  }

  insert(ele,newElement) {
    /**
     * 在指定的元素后面插入一个元素
     * 
     */
    let currentNode = this.findByValue(ele);
    if(currentNode === -1) {
      return -1;
    }
    const newNode = new Node(newElement);
    newNode.next = currentNode.next;
    currentNode.next = newNode;
    return true;
  }
  remove(ele) {
    const prevNode = this.findPrev(ele);
    if(prevNode === -1) {
      console.log('没找到元素')
      return false
    }
    prevNode.next = prevNode.next.next;
  } 

  show(){
    let currentNode = this.head.next;
    while(currentNode !== null) {
      currentNode = currentNode.next;
    }
  }
}
const linkedList = new SinglyLinkedList();
linkedList.append('a');
linkedList.append('b');
linkedList.append('c');
linkedList.append('d');
console.log('----------------')
console.log(linkedList.findByValue('c'))
console.log(linkedList.findByIndex(1))