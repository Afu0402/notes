const INTEGER = "INTEGER";
const PLUS = "PLUS"; 
const EOF = "EOF"; //表示没有更多的字符需要解析


//判断一个字符串是否可以被转为整数;
function isDigit(str) {
  return !isNaN(Number(str));
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `Token${this.type},${this.value}`;
  }

  repr() {
    return this.str();
  }
}


/**
 * Interpreter
 * 只支持输入要给简单的单数加法表达式例如：‘3+5’ 并不允许有空格；
 * 该程序期望去根据输入的字符解析出来的token寻找出:INTEGER -> PLUS -> INTEGER.的结构；
 * 
 */

class Interpreter {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.current_token = null;
  }

  error() {
    throw "Error parsing input";
  }

  get_next_token() {
    /**
     * "词法分析器" (lexical analyzer)、
     *  将用户输入的字符分解成一个个token;
     */
    let text = this.text;
    let token, current_char;

    if (this.pos > text.length - 1) {
      return new Token(EOF, null);
    }

    current_char = text[this.pos];

    if (isDigit(current_char)) {
      token = new Token(INTEGER, Number(current_char));
      this.pos += 1;
      return token;
    }
    if (current_char === "+") {
      token = new Token(PLUS, current_char);
      this.pos += 1;
      return token;
    }

    this.error();
  }

  eat(token_type) {
    // 验证当前的 token类型是否是解析器期望的token类型；
      if (this.current_token.type === token_type) {
        this.current_token = this.get_next_token();
      } else {
        this.error();
      }
  }

  expr() {
    /**
     * 负责找到期望的结构( INTEGER -> PLUS -> INTEGER)
     */
    this.current_token = this.get_next_token();

    let left = this.current_token;
    this.eat(INTEGER);

    let op = this.current_token;
    this.eat(PLUS);

    let right = this.current_token;
    this.eat(INTEGER);

    return left.value + right.value;
  }
}

let interpreter = new Interpreter("3+5");
interpreter.expr(); //output: 8
