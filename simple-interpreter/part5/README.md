# 构建一个简单的解释器 （五）

## 如何解析像 “14 + 2 * 3 - 6 / 2” 这样的算术表达式？；
在这之前所先要了解 结合律（associativity） 和 优先级 （precedence）.  
按照惯例像 7+3+1 等同于 (7+3) + 1.但是像 7-3-1  7-(3-1)。其结果就不一样了。  
### 在普通算术和大多数编程语言中，加法、减法、乘法和除法都是左结合的:  
7 + 3 + 1 is equivalent to (7 + 3) + 1  
7 - 3 - 1 is equivalent to (7 - 3) - 1  
8 * 4 * 2 is equivalent to (8 * 4) * 2  
8 / 4 / 2 is equivalent to (8 / 4) / 2  
## 什么是左结合(left-associative)?
当表达式7 + 3 + 1中像3这样的操作数两边都有加号时，我们需要一个约定来决定哪个操作数适用于3。是在操作数3的左边还是右边?运算符+与左边关联因为一个两边都有加号的操作数属于左边的运算符所以我们说运算符+是左关联的。这就是为什么根据结合律7 + 3 + 1等价于(7 + 3)+ 1。  
在  7 + 5 * 2 这个表达式里 5 两边有着不同的操作符，那么操作符应该是 7 + (5 * 2) or (7 + 5) * 2?,在这个例子里单纯的套用结合律就没用了,因为结合律只适合一种类型的操作符， 到这里就需要一种约定来解决相关的优先级问题。通常我们知道 *和/比+和-具有更高的优先级，基于此 我们可以构造一张优先级的列表 然后根据该表构造 适合该算术表达式的语法： 

| 优先级 | 结合律 | 操作符 |
|-----|-------|------|
| 2 | left | -, + |
| 1 | left | *,/ |


## grammar
* expr : term((PLUS|MINUS)term) *
* term : factor((MUL|DIV)factor)) *
* factor : INTEGER

## 完整代码

    const INTEGER = "INTEGER";
    const PLUS = "PLUS";
    const EOF = "EOF"; //表示没有更多的字符需要解析
    const MINUS = "MINUS";
    const MUL = "MUL";
    const DIV = "DIV";

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
        this.eat(INTEGER);
        return token.value;
      }

      term() {
        // TERM: factor((MUL|DIV)factor)*
        let result = this.factor();
        while ([MUL, DIV].includes(this.current_token.type)) {
          let token = this.current_token;
          if (token.type === MUL) {
            this.eat(MUL);
            result = result * this.factor();
          }

          if (token.type === DIV) {
            this.eat(DIV);
            result = result / this.factor();
          }
        }
        return result;
      }

      expr() {
        // expr: term((PLUS|MIUNS)term)*
        //Syntax analysis
        //Arithmetic expression parser
        let result = this.term()

        while ([MINUS, PLUS].includes(this.current_token.type)) {
          let token = this.current_token;
          if (token.type === MINUS) {
            this.eat(MINUS);
            result = result - this.term();
          }

          if (token.type === PLUS) {
            this.eat(PLUS);
            result = result + this.term();
          }
        }

        return result;
      }
    }



















  