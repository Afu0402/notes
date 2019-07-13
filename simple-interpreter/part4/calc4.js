const INTEGER = "INTEGER";
const PLUS = "PLUS";
const EOF = "EOF"; //表示没有更多的字符需要解析
const MINUS = "MINUS";

//判断一个字符串是否可以被转为整数;
function isDigit(str) {
  return !isNaN(Number(str));
}
function isspace(str) {
  const reg = /^\s$/g;
  return reg.test(str);
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

// lexical analysis
class Lexer {
  constructor () {
    this.text = text;
    this.pos = 0;
    this.current_char = this.text[this.pos];
  }

  error() {
    throw "SyntaxError: invalid syntax";
  }

  advance() {
    //向前移动指针并更新 current_char字符；
    this.pos += 1;
    if (this.pos > this.text.length - 1) {
      this.current_char = null;
    } else {
      this.current_char = this.text[this.pos];
    }
  }

  skip_whitespace() {
    //跳过空白符把指针+1 更新current_char的值；
    while (this.current_char !== null && isspace(this.current_char)) {
      this.advance();
    }
  }

  get_next_token() {
    /**
     * "词法分析器" (lexical analyzer)、
     *  将用户输入的字符分解成一个个token;
     */

    while (this.current_char !== null && this.current_char !== undefined) {
      if (isspace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }

      if (isDigit(this.current_char)) {
        return new Token(INTEGER, this.integer());
      }

      if (this.current_char === "+") {
        this.advance();
        return new Token(PLUS, "+");
      }

      if (this.current_char === "-") {
        this.advance();
        return new Token(MINUS, "-");
      }

      this.error();
    }
    return new Token(EOF, null);
  }

  integer() {
    // 循环查找字符知道碰到一个不是整数字符位置。合并查找到的字符并返回一个整数数字；
    let result = "";
    while (this.current_char !== null && isDigit(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return Number(result);
  }
  
}

/**
 * Interpreter
 * 只支持输入要给简单的单数加法表达式例如：‘3+5’ 并不允许有空格；
 * 该程序期望去根据输入的字符解析出来的token寻找出:INTEGER -> PLUS -> INTEGER.的结构；
 *
 */

class Interpreter {
  constructor(Lexer) {
    this.Lexer =  Lexer
    this.current_token = null;

  }

  error() {
    throw "SyntaxError: invalid syntax";
  }

  eat(token_type) {
    if (this.current_token.type === token_type) {
      this.current_token = this.Lexer.get_next_token();
    } else {
      this.error();
    }
  }

  factor() {
    // returan an INTEGER token value
    const token = this.current_token;
    this.eat(INTEGER);
    return token.value;
  }

  expr() {
    //Syntax analysis
    //Arithmetic expression parser 
    let result = this.factor();

    while([MINUS,PLUS].includes(this.current_token.type)) {
      let token = this.current_token;
      if(token.type === MUL) {
        this.eat(MUL);
        result = result * this.factor();
      }

      if(token.type === DIV) {
        this.eat(DIV);
        result = result / this.factor();
      }
    }

    return result;
  }
}


function main () {
  const text =  process.argv.splice(2).join('');
  const Lexer = new Lexer(text);
  let interpreter = new Interpreter(Lexer);
console.log(interpreter.expr()); 
}
main();