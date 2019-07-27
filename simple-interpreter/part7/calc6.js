const INTEGER = "INTEGER";
const PLUS = "PLUS";
const EOF = "EOF"; //表示没有更多的字符需要解析
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const LPAREN = "(";
const RPAREN = ")";

class AST {
  constructor(object) {}
}

class BinOp {
  constructor(left, op, right) {
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class Num {
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

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
  constructor(text) {
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

      if (this.current_char === "*") {
        this.advance();
        return new Token(MUL, "*");
      }

      if (this.current_char === "/") {
        this.advance();
        return new Token(DIV, "/");
      }

      if (this.current_char === "(") {
        this.advance();
        return new Token(LPAREN, "(");
      }

      if (this.current_char === ")") {
        this.advance();
        return new Token(RPAREN, ")");
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

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.current_token = this.lexer.get_next_token();
  }

  error() {
    throw "SyntaxError: invalid syntax";
  }

  eat(token_type) {
    if (this.current_token.type === token_type) {
      this.current_token = this.lexer.get_next_token();
    } else {
      this.error();
    }
  }

  factor() {
    // factor: INTEGER；
    // returan an INTEGER token value
    const token = this.current_token;
    if (token.type === INTEGER) {
      this.eat(INTEGER);
      return new Num(token);
    } else if (token.type === LPAREN) {
      this.eat(LPAREN);
      let node = this.expr();
      this.eat(RPAREN);
      return node;
    }
  }

  term() {
    // TERM: factor((MUL|DIV)factor)*
    let node = this.factor();
    while ([MUL, DIV].includes(this.current_token.type)) {
      let token = this.current_token;
      if (token.type === MUL) {
        this.eat(MUL);
      }

      if (token.type === DIV) {
        this.eat(DIV);
      }

      node = new BinOp(node, token, this.factor());
    }
    return node;
  }

  expr() {
    // expr: term((PLUS|MIUNS)term)*
    //Syntax analysis
    //Arithmetic expression parser

    // expr   : term ((PLUS | MINUS) term)*
    // term   : factor ((MUL | DIV) factor)*
    // factor : INTEGER | LPAREN expr RPAREN
    let node = this.term();

    while ([MINUS, PLUS].includes(this.current_token.type)) {
      let token = this.current_token;
      if (token.type === MINUS) {
        this.eat(MINUS);
      }

      if (token.type === PLUS) {
        this.eat(PLUS);
      }
      node = new BinOp(node, token, this.term());
    }

    return node;
  }

  parse() {
    return this.expr();
  }
}

function evaluate(tree) {
  if(tree.left && tree.left.type === INTEGER) {
    if(tree.op.type === PLUS) {
      tree.left + evaluate(tree.right);
    }

    if(tree.op.type === MUL) {
      tree.left * evaluate(tree.right);
    }
  }

  if(tree.right && tree.right.type === INTEGER) {
    if(tree.op.type === PLUS) {
      tree.right + evaluate(tree.left);
    }

    if(tree.op.type === MUL) {
      tree.right * evaluate(tree.left);
    }
  }

  return tree.value;
}
const main = () => {
  // const text = process.argv.splice(2).join("");
  const lexer = new Lexer("2 * 7 + 3");

  let interpreter = new Parser(lexer);
  console.log(evaluate(interpreter.parse()));
};
main();
debugger;
