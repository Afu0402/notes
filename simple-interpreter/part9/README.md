# 构建一个简单的解释器-解析简单的复合语句
## 如何解析和解释 Pascal 程序定义;
下面是一个类 Pascal 的语言示例;

      BEGIN
          BEGIN
              number := 2;
              a := number;
              b := 10 * a + 10 * number / 4;
              c := a - - b
          END;
          x := 11;
      END.


在这段程序里,可以发现在pascal里每一个语句的开始都是伴随BEGIN 结束伴随着END.BEGIN 和END可以是一系列语句 或者 又是一段 BEGIN END 的复合语句,每一个语句的后面如果还有别的语句需要在结尾加";", 复制语句则是可以用 英文或则英文+数字+下划线 为一个标识符开始,接着跟着一个 :=  :=表示赋值的操作.再接着就是 表达式. := 的左边的就是变量的名字 右边就是要赋值给变量的值或表达式; 整段程序的结尾以点 . 结束;  
根据上面的程序可以得出以下语法规则:  


    program: compound-statement DOT
    compund-statement: BEGIN statement-list END
    statement-list: statement | statement SEMI  statement 
    statement: compund-statement | assginment-statement | empty
    assginment: variable ASSGIN expr
    variable: ID
    empty: empty:
    factor: PLUS factor | MINUS factro| INTEGER | LPAREN expr RPAREN | variable

    
### program
 一个Pascal的程序是由一系列的复合语句组成的结尾以 "." 结束.例如 "BEGIN END."
### compound-statement
一个compound-statement是由 BEGIN 和 END包裹着的一个语句块.里面可以包含多个语句或其他  compound-statement; 语句块内部每个语句除了最后一个语句之外都要在语句的末尾用";"结束. 最后一个语句 ;可加可不加.
### statemnt-list
就是一个复合语句里面包含一个或多个语句的列表
### assginment-statement
一个变量 跟着一个 ASSGIN token 例如 “:=” 字符后跟着一个表达式例如 a := 2 + 2;
### variable
一个variable就是一个标识符。用 ID token 表示该标识符，token的值就是该变量名的名字；

---------------------------------------------

* BEGIN - 表示一个复合语句的开始
* END   - 表示一个复合语句的结束
* DOT   - 表示程序的结束
* ASSGIN - 表示 ‘:=’ 赋值符号
* SEMI - 表示 ‘；’ 用于语句的和复合语句的结束符号
* ID - 表示一个有效的标识符(支持英文小写开头或_开头后可跟数据)-变量；

为了分辨拥有相同字符开头标识符，比如（: := , == vs =>) 需要一个peek方法。他会返回当前字符得下一个字符。以此来判断相同开头字符的区别；

    peek () {
        peek_pos = this.pos += 1;
        if(peek_pos > this.text.length - 1) {
            return Null
        } 
        return this.text[peek_pos];
    }
Pascal里的变量和保留字都属于特殊的标识符。所以统一用同一个方法 _ID 处理。它判断当前的字符是不是英文字母。并循环组成一个字符串，然后利用该字符串去保留字的匹配是否有对应的保留字 BEGIN or END 如果是返回该保留字token。如果不是则返回 ID token;

    const reserved_keywords = { //保留字对象集合
        BEGIN: new Token(BEGIN,'BEGIN'),
        END: new Token(END,'END'),
    }

    _id(){
    let result = '';
    while(this.current_char !== null && isalnum(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return reserved_keywords[result] || new Token(ID,result);
  }


完整代码

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
    const reg = /^[a-zA-Z]+$/;
    return reg.test(str)
    }
    function isalnum(str) { //判断一个字符是不是英文字母或者数字；
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

    const reserved_keywords = { //保留字对象集合
    BEGIN: new Token(BEGIN,'BEGIN'),
    END: new Token(END,'END'),
    }

    // lexical analysis
    class Lexer {
    constructor(text) {
        this.text = text;
        this.pos = 0; // 当前字符的位置；
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
        // 判断一个字符是否只有英文字母组成，组成字符串后匹配是否是保留字。如果是返回相应的保留字，否则返回ID token 既一个变量标识符；
        let result = '';
        while(this.current_char !== null && isalnum(this.current_char)) {
        result += this.current_char;
        this.advance();
        }
        return reserved_keywords[result] || new Token(ID,result);
    }

    peek(){
        // 提前返回下一个字符 为了方便判断拥有相同字符开头的字符串 比如 = := == => ===
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
        if(this.current_char === '.') {
            this.advance();
            return new Token(DOT,'.')
        }

        this.error();
        }
        return new Token(EOF, null);
    }

    integer() {
        // 循环查找字符之到碰到一个不是整数字符位置。合并查找到的字符并返回一个整数数字；
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

    eat(token_type) {// 判断传进来的类型是否和当前类型稳合，是的话跳到下一个字符。主要是用来判断当前的token是否复合语法的token.
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
        //返回一元+的操作数 token 
        this.eat(PLUS);
        return new UnaryOp(token,this.factor())
        } else if(token.type === MINUS){
        //返回一元-的操作数 token 
        this.eat(MINUS);
        return new UnaryOp(token,this.factor())
        }else if (token.type === INTEGER) {
        this.eat(INTEGER);
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
        //program: compound-statement DOT
        let node = this.compound_statement();
        this.eat(DOT);
        return node;
    }

    compound_statement(){
        /**
        * compund-statement: BEGIN statement-list END
        * 解析复合语句
        * 
        */
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
        /**
        * 
        * statement-list: statement | statement SEMI statement
        * 
        * 
        */
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
        //statement: compund-statement | assginment-statement | empty 
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
        // assginment: variable ASSGIN expr
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
        if(this.current_token.type != EOF) {
        this.error();
        }
        return node;
    }
    }
    class NodeVisitor {
    visit(node) {
        // 获取node节点的构造函数名。这样之后只要在子类添加 visit_开头+对应的node类名的方法就可以了。子类只需要调用visit就能自动判断应该调用哪个对应的visit_Node方法
        const method_name = `visit_${node.constructor.name}`;
        return this[method_name](node)
    }
    }

    class Interpreter extends NodeVisitor {
    constructor(parser){
        super()
        this.parser = parser;
        this.GLOBAL_SCOPE = {}; //临时粗存变量的地方；
    }  

    visit_Assign(node) {
        const varName = node.left.value
        this.GLOBAL_SCOPE[varName] = this.visit(node.right)
    }
    visit_Var(node) {
        let varName = node.value
        if(!this.GLOBAL_SCOPE[varName]) {
        throw `${verName} is not defined`;
        }
        return this.GLOBAL_SCOPE[varName];
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
        BEGIN
            number := 2;
            a := number * 3;
        END;
        x := 11;
        END.
    `);

    let parse = new Parser(lexer)
    let interpretor = new Interpreter(parse)
    interpretor.interpret();
    console.log(interpretor.GLOBAL_SCOPE);
    };
    main();
















