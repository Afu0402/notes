class Node {
  constructor(element) {
    this.prev = null;
    this.next = null;
    this.element = element;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = new Node('head');
    this.tail = null;
    this.length = 0;
  }

  append(item) {
    const newNode = new Node(item);
    let current = this.head.next;
    if(this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      while(current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
      newNode.prev = current;
      this.tail = newNode;
    }
    this.length++;
    return true;
  }

  findByIndex(posistion) {
    let pos = 0;
    let current = this.head.next;
    if(pos !== posistion && current !== null) {
      current = current.next;
    }
    return current === null ? 1 : current;
  }

  insert(element,posistion) {
    if(posistion > this.length) {
      return -1;
    }
    this.length++;
    let current;
    let newNode = new Node(element);
    if(posistion === 0) {
      current = this.head.next;
      this.head = newNode;
      newNode.next = current;
      current.prev = newNode;
      return true;
    } 

    if(posistion === this.length) {
      current = this.tail;
      current.next = newNode;
      newNode.prev = current;
      this.tail = newNode;
      return true;
    }
    current = this.findByIndex(posistion)
    let previous = current.prev;
    newNode.prev = previous;
    newNode.next = current;
    current.prev = newNode;
    previous.next = newNode;
    return true;
  }

  show(){
    let currentNode = this.head.next;
    while(currentNode !== null) {
      currentNode = currentNode.next;
    }
  }
}
const doublyLinkedList = new DoublyLinkedList();
doublyLinkedList.append('a');
doublyLinkedList.append('b');
doublyLinkedList.append('c');
doublyLinkedList.append('d');
console.log('----------------')
console.log(doublyLinkedList.findByIndex(1))
