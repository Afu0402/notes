
/**
 * 双向链表；
 * 双向链表和单向链表的区别就是可以很方便的找到元素的前一个和下一个， 尤其在根据查找元素坐标查找元素的时候可以判断传入的坐标位置是偏前还是偏后，从而可以决定是从头循环
 * 还是从后开始循环。
 * 
 */
class Node {
  constructor(element) {
    this.prev = null;
    this.next = null;
    this.element = element;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = new Node("head");
    this.tail = this.head;
    this.length = 0;
  }

  append(item) {
    const newNode = new Node(item);
    let current = this.tail;
    current.next = newNode;
    newNode.prev = current;
    this.tail = newNode;
    this.length++;
    return true;
  }

  findByIndex(index) {
    /**
     * 通过元素的位置查找元素，如果没有则返回-1
     * 默认从0开始；
     */
    if (index === 0) {
      // 如果是第一个直接返回
      return this.head.next;
    }
    if (index === this.length) {
      // 如果是最后一个直接返回
      return this.tail;
    }

    let currentNode = this.head.next;
    let pos = 0;
    // 循环找到对应的元素，找不到返回1；
    while (currentNode !== null && pos !== index) {
      currentNode = currentNode.next;
      pos++;
    }
    return currentNode === null ? -1 : currentNode;
  }

  insert(element, posistion) {
    /**
     * 指定的位置插入元素
     */
    if (posistion >= 0 && posistion <= this.length) {
      let newNode = new Node(element);
      if (posistion === 0) {
        let current = this.head.next;
        this.head.next = newNode;
        newNode.prev = this.head;
        if (current === null) {
          this.tail = newNode;
        } else {
          newNode.next = current;
          current.prev = newNode;
        }
        this.length++;
        return true;
      }

      if (posistion === this.length) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
        this.length++;
        return  true;
      }
      let current = this.findByIndex(posistion)
      if (current !== -1) {
        let provide = current.prev;

        newNode.next = current;
        newNode.prev = provide;
        provide.next = newNode;
        current.prev = newNode;

        this.length++;
        return true;
      }
      return false;
    }
  }

  remove(posistion) {
    if (posistion >= 0 && posistion <= this.length && this.length !== 0) {
      if (posistion === 0) {
        let current = this.head.next;
        this.head.next = current.next;
        this.head.next.prev = this.head;
        if(this.length === 1) {
          this.tail = this.head.next;
        }
      } else if (posistion === this.length - 1) {
        let current = this.tail;
        this.tail = current.prev;
        this.tail.next = null;
      } else {
        let current = this.findByIndex(posistion);
        let provide = current.prev;
        provide.next = current.next;
        provide.next.prev = provide;
      }
      this.length--
    }
  }

  show() {
    let currentNode = this.head.next;
    let pos = 0;
    while (currentNode !== null) {
      console.log(currentNode);
      pos++;
      currentNode = currentNode.next;
    }
  }
}
const doublyLinkedList = new DoublyLinkedList();

doublyLinkedList.append("e");
doublyLinkedList.append("f");
doublyLinkedList.insert("b+", 0);
doublyLinkedList.insert("b2", 0);
doublyLinkedList.insert("b3", 2);
doublyLinkedList.show();
console.log("----------------");
doublyLinkedList.remove(2);
doublyLinkedList.show();

// console.log(doublyLinkedList.findByIndex(0));
debugger;
