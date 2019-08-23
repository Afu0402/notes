const INTEGER = "INTEGER";
const PLUS = "PLUS";
const EOF = "EOF"; //表示没有更多的字符需要解析
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const LPAREN = "(";
const RPAREN = ")";
const ID = "ID"
const ASSIGN = 'ASSIGN';
const SEMI = ';';
const DOT = 'DOT';
const BEGIN = 'BEGIN';
const END ='END'


class AST {
  constructor(object) {}
}

class Assign {
  constructor(left,op,right) {
    this.token = this.op = op;
    this.left = left;
    this.right = right;
  }
}

class Compound {
  constructor(){
    this.children = [];
  }
}
class Var {
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

class NoOp{
  
}

class BinOp {
  constructor(left, op, right) {
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class UnaryOp {
  constructor(op,expr) {
    this.token = this.op = op;
    this.expr = expr;
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
function isalpha(str) {//判断一个字符是不是只有英文字母组成；
  const reg = /^[_a-zA-Z]\w*$/;
  return reg.test(str)
}
function isalnum(str) { //判断一个字符是不是英文字母或者数字；
  const reg = /^[_a-zA-Z0-9]+$/;
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

const reserved_keywords = { //保留字对象集合
  let: new Token('LET','let'),
  BEGIN: new Token(BEGIN,'BEGIN'),
  END: new Token(END,'END'),
  DIV: new Token(DIV,'DIV'),
  get(key) {
    let keyUpCase = key.toUpperCase();
    return this[keyUpCase];
  },
  set(key,value) {
    let keyUpCase = key.toUpperCase();
    this[keyUpCase] = value;
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

  _id(){
    let result = '';
    while(this.current_char !== null && isalnum(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return reserved_keywords.get(result) || new Token(ID,result);
  }

  peek(){
    let peek_pos = this.pos + 1;
    if(peek_pos > this.text.length - 1) {
      return null
    }
    return this.text[peek_pos];
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
      if(isalpha(this.current_char)) {
        return this._id();
      }
      if(this.current_char === ':' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(ASSIGN,':=')
      }
      if (isspace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }
      if(this.current_char === ';') {
        this.advance();
        return new Token(SEMI,';');
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

      // if (this.current_char === "/") {
      //   this.advance();
      //   return new Token(DIV, "/");
      // }

      if (this.current_char === "(") {
        this.advance();
        return new Token(LPAREN, "(");
      }

      if (this.current_char === ")") {
        this.advance();
        return new Token(RPAREN, ")");
      }
      if(this.current_char === '.') {
        this.advance();
        return new Token(DOT,'.')
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

    // factor : (PLUS | MINUS) factor | INTEGER | LPAREN expr RPAREN

    const token = this.current_token;
    if(token.type === PLUS) {
      this.eat(PLUS);
      return new UnaryOp(token,this.factor())
    } else if(token.type === MINUS){
      this.eat(MINUS);
      return new UnaryOp(token,this.factor())
    }else if (token.type === INTEGER) {
      this.eat(INTEGER);
      return new Num(token);
    } else if (token.type === LPAREN) {
      this.eat(LPAREN);
      let node = this.expr();
      this.eat(RPAREN);
      return node;
    } else {
      return this.variable();
    }
  }

  program() {
    let node = this.compound_statement();
    this.eat(DOT);
    return node;
  }

  compound_statement(){
    this.eat(BEGIN);
    let nodes = this.statement_list();
    this.eat(END);

    let root = new Compound();
    for(let node of nodes) {
      root.children.push(node);
    }

    return root;
  }

  statement_list(){
    let node = this.statement();
    let nodes = [node];
    while(this.current_token.type === SEMI) {
      this.eat(SEMI);
      nodes.push(this.statement())
    }

    if(this.current_token.type === ID) {
      this.error();
    }

    return nodes;
  }

  statement(){
    let node;
    if(this.current_token.type === BEGIN) {
       node = this.compound_statement();
    } else if (this.current_token.type === ID) {
       node = this.assginment_statement();
    }else {
       node = this.empty();
    }

    return node ;
  }

  assginment_statement(){
    let left = this.variable();
    let token = this.current_token;
    this.eat(ASSIGN);
    let right =this.expr();
    return new Assign(left,token,right)
  }

  variable(){
    let node = new Var(this.current_token);
    this.eat(ID);
    return node
  }

  empty(){
    return new NoOp();
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
    let node = this.program();
    if(this.current_token.type != EOF) {
      this.error();
    }
    return node;
  }
}
class NodeVisitor {
  visit(node) {
    const method_name = `visit_${node.constructor.name}`;
    return this[method_name](node)
  }
}

class Interpreter extends NodeVisitor {
  constructor(parser){
    super()
    this.parser = parser;
    this.GLOBAL_SCOPE = {
      get(key){
        let keyUpperCase = key.toUpperCase();
        return this[keyUpperCase]
      },
      set(key,value){
        let keyUpperCase = key.toUpperCase();
        this[keyUpperCase] = value;
      }
    };
  }  

  visit_Assign(node) {
    const varName = node.left.value
    this.GLOBAL_SCOPE.set(varName,this.visit(node.right))
  }
  visit_Var(node) {
    let varName = node.value
    console.log(varName)
    if(!this.GLOBAL_SCOPE.get(varName)) {
      throw `${varName} is not defined`;
    }
    return this.GLOBAL_SCOPE.get(varName);
  }

  visit_Compound(node) {
    for(let child of node.children) {
      this.visit(child)
    }
  }

  visit_NoOp(node) {

  }

  visit_BinOp(node) {
    if(node.op.type === PLUS) {
      return this.visit(node.left) + this.visit(node.right);
    }
    if(node.op.type === MINUS) {
      return this.visit(node.left) - this.visit(node.right);
    }
    if(node.op.type === DIV) {
      return this.visit(node.left) / this.visit(node.right);
    }
    if(node.op.type === MUL) {
      return this.visit(node.left) * this.visit(node.right);
    }
  }
  visit_Num(node) {
    return node.value;
  }

  visit_UnaryOp(node) {
    if(node.op.type === PLUS) {
      return +this.visit(node.expr)
    } else if (node.op.type === MINUS) {
      return -this.visit(node.expr)
    }
  }

  interpret() {
    let tree = this.parser.parse();
    console.log(tree)
    return this.visit(tree);
  }
}
const main = () => {
  const lexer = new Lexer(`
    BEGIN
          _umber := 10 div 2 div 2;
    END.
  `);
  let parse = new Parser(lexer)
  let interpretor = new Interpreter(parse)
  interpretor.interpret();
  console.log(interpretor.GLOBAL_SCOPE);
};
main();
debugger