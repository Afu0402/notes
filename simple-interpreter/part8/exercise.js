// 2*7+(2+2);

const INTEGER = "INTEGER";
const PLUS = "PLUS";
const EOF = "EOF"; 
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const LPAREN = "(";
const RPAREN = ")";

class AST {
  
}

class BinOp{
  constructor(left,op,right){
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class UnaryOp{
  constructor(op,expr){
    this.token = this.op = op;
    this.right = right;
    this.expr = expr;
  }
}

class Num {
  constructor(token) {
    this.token = token;
    this.value = token.value
  }
}

class Token {
  constructor(type,val){
    this.type = type;
    this.value = val;
  }
}

function isDigit(str) {
  return !isNaN(Number(str));
}
function isspace(str) {
  const reg = /^\s$/g;
  return reg.test(str);
}

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.current_char = this.text[this.pos]
  }

  error(){
    throw "SyntaxError: invalid syntax";
  }

  advance(){
    this.pos+=1;
    if(this.pos > this.text.length - 1) {
      this.current_char = null;
    } else {
      this.current_char = this.text[this.pos]
    }
  }

  skip_whitespace(){
    while (this.current_char !== null && isspace(this.current_char)) {
      this.advance();
    }
  }

  interger(){
    let result = '';
    while(this.current_char !== null && isDigit(this.current_char)) {
      result+=this.current_char;
      this.advance();
    }
    return Number(result);
  }

  get_next_token(){
    while(this.current_char !== null && this.current_char !== undefined) {
      if(isspace(this.current_char)) {
        this.skip_whitespace();
        continue
      }

      if(isDigit(this.current_char)) {
        return new Token(INTEGER,this.interger())
      }

      if(this.current_char === '+') {
        this.advance();
        return new Token(PLUS,'+')
      }
      if(this.current_char === '-') {
        this.advance();
        return new Token(MINUS,'-')
      }
      if(this.current_char === '*') {
        this.advance();
        return new Token(MUL,'*')
      }
      if(this.current_char === '/') {
        this.advance();
        return new Token(DIV,'/')
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

    return new Token(EOF,null)

  }
}

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.current_token = this.lexer.get_next_token();
  }

  factor(){
    let token = this.current_token;
    if(token.type === INTEGER) {
      this.eat(INTEGER)
      return new Num(token);
    } else if(token.type === LPAREN) {
      this.eat(LPAREN)
      let node = this.expr()
      this.eat(RPAREN)
      return node;
    }
  }

  error(){
    throw "SyntaxError: invalid syntax";
  }

  eat(type){
    if(this.current_token.type === type) {
      this.current_token = this.lexer.get_next_token();
    } else {
      this.error();
    }
  }

  term(){
    let node = this.factor();
    while([DIV,MUL].includes(this.current_token.type)) {
      let token = this.current_token;
      if(token.type === DIV) {
        this.eat(DIV)
      }

      if(token.type === MUL) {
        this.eat(MUL)
      }

      node = new BinOp(node,token,this.factor())
    }

    return node;
  }

  expr(){
    let node = this.term();
    while([PLUS,MINUS].includes(this.current_token.type)) {
      let token = this.current_token;
      if(token.type === PLUS) {
        this.eat(PLUS)
      }

      if(token.type === MINUS) {
        this.eat(MUL)
      }

      node = new BinOp(node,token,this.term())
    }

    return node;
  }
  parse(){
    return this.expr();
  }
}

class NodeVisiter {
  visit(node){
    const method_name = `visit_${node.constructor.name}`;
    return this[method_name](node)
  }
}

class Interpreter extends NodeVisiter {
  constructor(parser) {
    super();
    this.parser = parser
  }

  visit_BinOp(node) {
    if(node.op.type === PLUS) {
      return this.visit(node.left) + this.visit(node.right);
    }
    if(node.op.type === MUL) {
      return this.visit(node.left) * this.visit(node.right);
    }
    if(node.op.type === MINUS) {
      return this.visit(node.left) - this.visit(node.right);
    }
    if(node.op.type === DIV) {
      return this.visit(node.left) / this.visit(node.right);
    }
  }
  visit_Num(node){
    return node.value;
  }

  interpret(){
    const tree = this.parser.parse();
    console.log(tree);
    return this.visit(tree)
  }
}

function main() {
  let lexer = new Lexer('7 * 2+(  2+3 )');
  let parser = new Parser(lexer);
  let interpreter = new Interpreter(parser)
  console.log(interpreter.interpret())
}
main();