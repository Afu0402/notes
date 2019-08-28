const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const EOF = 'EOF'; //表示没有更多的字符需要解析
const MINUS = 'MINUS';
const MUL = 'MUL';
const LPAREN = '(';
const RPAREN = ')';
const ID = 'ID';
const ASSIGN = 'ASSIGN';
const SEMI = ';';
const DOT = 'DOT';
const BEGIN = 'BEGIN';
const END = 'END';
const COLON = ':';
const FLOAT_DIV = '/';
const VAR = 'VAR';
const REAL = 'REAL';
const PROGRAM = 'PROGRAM';
const COMMA = ',';
const INTEGER_CONST = 'INTEGER_CONST';
const REAL_CONST = 'REAL_CONST';
const INTEGER_DIV = 'INTEGER_DIV';
const PROCEDURE = "PROCEDURE";


/** AST node */
class AST {
  constructor(object) {}
}

class Assign {
  constructor(left, op, right) {
    this.token = this.op = op;
    this.left = left;
    this.right = right;
  }
}

class Compound {
  constructor() {
    this.children = [];
  }
}
class Program {
  constructor(name, block) {
    this.name = name;
    this.block = block;
  }
}
class Block {
  constructor(declarations, compound_statement) {
    this.declarations = declarations;
    this.compound_statement = compound_statement;
  }
}

class VarDecl {
  constructor(var_node, type_node) {
    this.var_node = var_node;
    this.type_node = type_node;
  }
}

class ProcedureDecl {
  constructor(proc_name, block_node) {
    this.proc_name = proc_name;
    this.block_node = block_node;
  }
}

class Type {
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}
class Var {
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

class NoOp {}

class BinOp {
  constructor(left, op, right) {
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class UnaryOp {
  constructor(op, expr) {
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
/** Symbole */
class Symbol {
  constructor(name, type = null) {
    this.name = name;
    this.type = type;
  }
}

class BuiltinTypeSymbol extends Symbol {
  constructor(name) {
    super(name);
  }
}

class VarSymbol extends Symbol {
  constructor(name, type) {
    super(name, type);
  }
}

class SymbolTable {
  constructor() {
    this._symbols = {};
    this._initBuitinType();
  }

  _initBuitinType() {
    this.defineSymbol(new BuiltinTypeSymbol('INTEGER'));
    this.defineSymbol(new BuiltinTypeSymbol('REAL'));
  }

  defineSymbol(obj) {
    this._symbols[obj.name] = obj;
  }

  lookup(name) {
    return this._symbols[name];
  }
}

/** tools */
//判断一个字符串是否可以被转为整数;
function isDigit(str) {
  return !isNaN(Number(str));
}
function isspace(str) {
  const reg = /^\s$/g;
  return reg.test(str);
}
function isalpha(str) {
  //判断一个字符是不是只有英文字母组成；
  const reg = /^[a-zA-Z]+$/;
  return reg.test(str);
}
function isalnum(str) {
  //判断一个字符是不是英文字母或者数字；
  const reg = /^[a-zA-Z0-9]+$/;
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

const reserved_keywords = {
  //保留字对象集合
  BEGIN: new Token(BEGIN, 'BEGIN'),
  END: new Token(END, 'END'),
  DIV: new Token('INTEGER_DIV', 'DIV'),
  PROGRAM: new Token('PROGRAM', 'PROGRAM'),
  VAR: new Token('VAR', 'VAR'),
  INTEGER: new Token('INTEGER', 'INTEGER'),
  REAL: new Token('REAL', 'REAL'),
  PROCEDURE: new Token('PROCEDURE', 'PROCEDURE'),
};

/** lexical analysis */

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0; // 当前字符的位置；
    this.current_char = this.text[this.pos];
  }

  error() {
    throw 'SyntaxError: invalid syntax';
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

  _id() {
    // 判断一个字符是否只有英文字母组成，组成字符串后匹配是否是保留字。如果是返回相应的保留字，否则返回ID token 既一个变量标识符；
    let result = '';
    while (this.current_char !== null && isalnum(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return reserved_keywords[result] || new Token(ID, result);
  }

  peek() {
    // 提前返回下一个字符 为了方便判断拥有相同字符开头的字符串 比如 = := == => ===
    let peek_pos = this.pos + 1;
    if (peek_pos > this.text.length - 1) {
      return null;
    }
    return this.text[peek_pos];
  }

  skip_comment() {
    // 跳过注释语句 直到找到 '}'为止！
    while (this.current_char != '}') {
      this.advance();
    }
    this.advance();
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
      if (this.current_char === '{') {
        // 跳过注释例如  {..................}
        this.advance();
        this.skip_comment();
        continue;
      }

      if (this.current_char === ',') {
        this.advance();
        return new Token(COMMA, ',');
      }
      if (isalpha(this.current_char)) {
        return this._id();
      }
      if (this.current_char === ':' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(ASSIGN, ':=');
      }
      if (this.current_char === ':') {
        this.advance();
        return new Token(COLON, ':');
      }
      if (isspace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }
      if (this.current_char === ';') {
        this.advance();
        return new Token(SEMI, ';');
      }

      if (isDigit(this.current_char)) {
        return this.number();
      }

      if (this.current_char === '+') {
        this.advance();
        return new Token(PLUS, '+');
      }

      if (this.current_char === '-') {
        this.advance();
        return new Token(MINUS, '-');
      }

      if (this.current_char === '*') {
        this.advance();
        return new Token(MUL, '*');
      }

      if (this.current_char === '/') {
        this.advance();
        return new Token(FLOAT_DIV, '/');
      }

      if (this.current_char === '(') {
        this.advance();
        return new Token(LPAREN, '(');
      }

      if (this.current_char === ')') {
        this.advance();
        return new Token(RPAREN, ')');
      }
      if (this.current_char === '.') {
        this.advance();
        return new Token(DOT, '.');
      }

      this.error();
    }
    return new Token(EOF, null);
  }

  number() {
    // 循环查找字符之到碰到一个不是整数字符位置。合并查找到的字符并返回一个整数数字；
    let result = '';
    let token;
    while (this.current_char !== null && isDigit(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    if (this.current_char === '.') {
      result += this.current_char;
      this.advance();
      while (this.current_char !== null && isDigit(this.current_char)) {
        result += this.current_char;
        this.advance();
      }
      token = new Token('REAL_CONST', Number(result));
    } else {
      token = new Token('INTEGER_CONST', Number(result));
    }
    return token;
  }
}

/** Parser */
class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.current_token = this.lexer.get_next_token();
  }

  error() {
    throw 'SyntaxError: invalid syntax';
  }

  eat(token_type) {
    // 判断传进来的类型是否和当前类型稳合，是的话跳到下一个字符。主要是用来判断当前的token是否复合语法的token.
    if (this.current_token.type === token_type) {
      this.current_token = this.lexer.get_next_token();
    } else {
      this.error();
    }
  }

  factor() {
    // factor : PLUS factor | MINUS factor| INTEGER_CONST| REAL_CONST | LPAREN expr RPAREN| variable
    const token = this.current_token;
    if (token.type === PLUS) {
      //返回一元+的操作数 token
      this.eat(PLUS);
      return new UnaryOp(token, this.factor());
    } else if (token.type === MINUS) {
      //返回一元-的操作数 token
      this.eat(MINUS);
      return new UnaryOp(token, this.factor());
    } else if (token.type === INTEGER_CONST) {
      this.eat(INTEGER_CONST);
      return new Num(token);
    } else if (token.type === REAL_CONST) {
      this.eat(REAL_CONST);
      return new Num(token);
    } else if (token.type === LPAREN) {
      // LPAREN exper RPAREN
      this.eat(LPAREN);
      let node = this.expr();
      this.eat(RPAREN);
      return node;
    } else {
      // 返回一个ID token or reserved keywords
      return this.variable();
    }
  }

  program() {
    // 解析Pascal程序
    //program: PROGRAM variable SEMI block DOT
    this.eat(PROGRAM);
    let var_node = this.variable();
    let program_name = var_node.value;
    this.eat(SEMI);
    let block_node = this.block();
    let program_node = new Program(program_name, block_node);
    this.eat(DOT);
    return program_node;
  }

  block() {
    // block: declarations compound-statement
    let declarations = this.declarations();
    let compound_statement = this.compound_statement();
    return new Block(declarations, compound_statement);
  }

  declarations() {
    // declarations: VAR (variable_declaration  SEMT) + | (PROCEDUER ID SEMI block SEMI)* |  empty
    const declarations = [];
    if (this.current_token.type === VAR) {
      this.eat(VAR);

      while (this.current_token.type === ID) {
        const var_decl = this.variable_declaration();
        declarations.push(...var_decl);
        this.eat(SEMI);
      }
    }

    while(this.current_token.type === PROCEDURE) {
      this.eat(PROCEDURE);
      const proc_name = this.current_token.value;
      this.eat(ID);
      this.eat(SEMI);
      const block_node = this.block();
      const proc_decl = new ProcedureDecl(proc_name, block_node);
      declarations.push(proc_decl);
      this.eat(SEMI)
    }

    return declarations;
  }

  variable_declaration() {
    // variable_declaration : ID (COMMA ID)* COLON type_spec
    let var_nodes = [new Var(this.current_token)];
    this.eat(ID);

    while (this.current_token.type === COMMA) {
      this.eat(COMMA);
      var_nodes.push(new Var(this.current_token));
      this.eat(ID);
    }
    this.eat(COLON);

    let type_node = this.type_spec();
    let var_declarations = [];
    var_nodes.forEach(var_node =>
      var_declarations.push(new VarDecl(var_node, type_node))
    );

    return var_declarations;
  }

  type_spec() {
    let token = this.current_token;

    if (this.current_token.type === INTEGER) {
      this.eat(INTEGER);
    } else {
      this.eat(REAL);
    }
    return new Type(token);
  }

  compound_statement() {
    /**
     * compund-statement: BEGIN statement-list END
     * 解析复合语句
     *
     */
    this.eat(BEGIN);
    let nodes = this.statement_list();
    this.eat(END);

    let root = new Compound();
    for (let node of nodes) {
      root.children.push(node);
    }

    return root;
  }

  statement_list() {
    /**
     *
     * statement-list: statement | statement SEMI statement
     *
     *
     */
    let node = this.statement();
    let nodes = [node];
    while (this.current_token.type === SEMI) {
      this.eat(SEMI);
      nodes.push(this.statement());
    }

    if (this.current_token.type === ID) {
      this.error();
    }

    return nodes;
  }

  statement() {
    //statement: compund-statement | assginment-statement | empty
    let node;
    if (this.current_token.type === BEGIN) {
      node = this.compound_statement();
    } else if (this.current_token.type === ID) {
      node = this.assginment_statement();
    } else {
      node = this.empty();
    }

    return node;
  }

  assginment_statement() {
    // assginment: variable ASSGIN expr
    let left = this.variable();
    let token = this.current_token;
    this.eat(ASSIGN);
    let right = this.expr();
    return new Assign(left, token, right);
  }

  variable() {
    let node = new Var(this.current_token);
    this.eat(ID);
    return node;
  }

  empty() {
    return new NoOp();
  }

  term() {
    // TERM: factor((MUL|DIV)factor)*
    let node = this.factor();
    while ([MUL, INTEGER_DIV, FLOAT_DIV].includes(this.current_token.type)) {
      let token = this.current_token;
      if (token.type === MUL) {
        this.eat(MUL);
      }

      if (token.type === INTEGER_DIV) {
        this.eat(INTEGER_DIV);
      }

      if (token.type === FLOAT_DIV) {
        this.eat(FLOAT_DIV);
      }

      node = new BinOp(node, token, this.factor());
    }
    return node;
  }

  expr() {
    // expr: term (PLUS | MINUS) term
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
    if (this.current_token.type != EOF) {
      this.error();
    }
    return node;
  }
}

/** Visitor */
class NodeVisitor {
  visit(node) {
    // 获取node节点的构造函数名。这样之后只要在子类添加 visit_开头+对应的node类名的方法就可以了。子类只需要调用visit就能自动判断应该调用哪个对应的visit_Node方法
    const method_name = `visit_${node.constructor.name}`;
    return this[method_name](node);
  }
}

/** SymbolTableBuilder 
 * 遍历由Parser自动创建保存程序相关的符号；
*/

class SymbolTableBuilder extends NodeVisitor {
  constructor() {
    super();
    this.symtab = new SymbolTable();
  }

  visit_Program(node) {
    this.visit(node.block);
  }

  visit_Block(node) {
    for (let item of node.declarations) {
      this.visit(item);
    }
    this.visit(node.compound_statement);
  }

  visit_Compound(node) {
    for (let item of node.children) {
      this.visit(item);
    }
  }

  visit_ProcedureDecl(){

  }

  visit_BinOp(node) {
    this.visit(node.left);
    this.visit(node.right);
  }

  visit_UnaryOp(node) {
    this.visit(node.expr);
  }

  visit_Assign(node) {
    const var_name = node.left.value;
    const symbol = this.symtab.lookup(var_name);
    if(!symbol) {
      throw new SyntaxError(`${var_name} is not declaration `)
    }
    this.visit(node.right);
  }
  visit_Var(node) {
    const var_name = node.value;
    const symbol = this.symtab.lookup(var_name);
    if(!symbol) {
      throw new ReferenceError(`${var_name} is not defined`)
    }

  }

  visit_NoOp(node) {}
  visit_Num(node) {}

  visit_VarDecl(node) {
    const typeName = node.type_node.value;
    const typeSymbol = this.symtab.lookup(typeName);
    const varName = node.var_node.value;
    const varSymbol = new VarSymbol(varName,typeSymbol);
    this.symtab.defineSymbol(varSymbol);
  }
}

/** Interpreter */
class Interpreter extends NodeVisitor {
  constructor(parser) {
    super();
    this.parser = parser;
    this.GLOBAL_SCOPE = {}; //临时粗存变量的地方；
  }

  visit_Assign(node) {
    const varName = node.left.value;
    this.GLOBAL_SCOPE[varName] = this.visit(node.right);
  }
  visit_Var(node) {
    let varName = node.value;
    if (!this.GLOBAL_SCOPE[varName]) {
      throw `${verName} is not defined`;
    }
    return this.GLOBAL_SCOPE[varName];
  }

  visit_Compound(node) {
    for (let child of node.children) {
      this.visit(child);
    }
  }

  visit_Program(node) {
    this.visit(node.block);
  }
  
  visit_ProcedureDecl(node) {
    
  }

  visit_Block(node) {
    for (let decl of node.declarations) {
      this.visit(decl);
    }
    this.visit(node.compound_statement);
  }
  visit_VarDecl(node) {}

  visit_Type(node) {}

  visit_NoOp(node) {}

  visit_BinOp(node) {
    if (node.op.type === PLUS) {
      return this.visit(node.left) + this.visit(node.right);
    }
    if (node.op.type === MINUS) {
      return this.visit(node.left) - this.visit(node.right);
    }
    if (node.op.type === INTEGER_DIV || node.op.type === FLOAT_DIV) {
      return this.visit(node.left) / this.visit(node.right);
    }
    if (node.op.type === MUL) {
      return this.visit(node.left) * this.visit(node.right);
    }
  }
  visit_Num(node) {
    return node.value;
  }

  visit_UnaryOp(node) {
    if (node.op.type === PLUS) {
      return +this.visit(node.expr);
    } else if (node.op.type === MINUS) {
      return -this.visit(node.expr);
    }
  }

  interpret() {
    let tree = this.parser.parse();
    console.log(tree)
    let symtabBuiler = new SymbolTableBuilder();
      symtabBuiler.visit(tree);
      console.log(symtabBuiler.symtab)
    return this.visit(tree);
  }
}
const main = () => {
  const lexer = new Lexer(`
    PROGRAM Part10AST;
      VAR
        a, b : INTEGER;
        y    : REAL;
        PROCEDURE p1;
        VAR
          age : INTEGER;
        BEGIN
          age := 19;
        END;     
      BEGIN {Part10AST}
          a := 12;
          b := 30;
      END.  {Part10AST}
  `);

  let parse = new Parser(lexer);
  let interpret = new Interpreter(parse);
  interpret.interpret()
  console.log(interpret.GLOBAL_SCOPE)

};
main();
debugger;
