# 构建一个简单的解释器 （二）

## 扩展 calculator
1.可以处理用户输入的任何位置的空白字符。  
2.可以使用多位整数。  
3.增加减法的操作。  

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
        this.current_char = this.text[this.pos];
      }

      error() {
        throw "Error parsing input";
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

      integer() {
        // 循环查找字符知道碰到一个不是整数字符位置。合并查找到的字符并返回一个数字整数；
        let result = "";
        while (this.current_char !== null && isDigit(this.current_char)) {
          result += this.current_char;
          this.advance();
        }
        return Number(result);
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
        * 负责找到期望的结构：
        *  INTEGER -> PLUS -> INTEGER
        * INTEGER -> MINUS -> INTEGER
        */
        this.current_token = this.get_next_token();

        // we expect the current token to be an integer
        let left = this.current_token;
        this.eat(INTEGER);

        // we expect the current token to be either a '+' or '-';
        let op = this.current_token;
        if(op.type === PLUS) {
          this.eat(PLUS);
        } else {
          this.eat(MINUS);
        }
        // we expect the current token to be an integer
        let right = this.current_token;
        this.eat(INTEGER);

        /**
        * 经过上面的调用后 this.current_token 被设置为 EOF token
        * INTEGER PLUS INTEGER 或 INTEGER MINUS INTEGER 的 token 序列已经被成功找到后就可以根据序列规则完成相应的
        * 加法或减法运算并返回结果。
        *
        */
        if(op.type === PLUS) {
          return left.value + right.value;
        } else {
          return left.value - right.value;
        }
        
      }
    }

    let interpreter = new Interpreter(" 3 - 5");
    console.log(interpreter.expr()); //output: -2

## 相较于Part1代码，主要更改的代码如下：
1. 对 get_next_token 方法进行重构，把增加 pos 指针的代发放到了一个单独 advance方法中；   
2. skip_whitespace主要是忽略空白字符，integer方法处理 多位数的整数。
3. expr 方法增加识别  INTEGER -> MINUS -> INTEGER 。现在expre方法可以识别 addition to INTEGER -> PLUS 和 INTEGER -> MINUS -> INTEGER;


## 什么是解析(parsing)，什么是解析器（parser)？
在一个token流中查找结构的过程 或者说在一个toaken流程中识别短语的过程叫做 解析（parsing). 解释器和编译器执行这个过程的程序叫做 解析器(parser)；   
所以该程序中的expr是解析和解释发生的地方。expr 函数会先在token的流中一个个识别 ）INTEGER -> PLUS -> INTEGER 或 the INTEGER -> MINUS -> INTEGER 其中的一个，然后识别他们是 加法 还是减法 后返回相应的值。
## 什么是 lexeme?
词素是组成符号的字符序列,lexeme 就是一个token的实例,例如一个lexeme可能包含如下信息：  


| Token | sample lexemes | 
|-----|-------|
| INTEGER | 1, 34 ,5 ,6 |
| PLUS | + |
| MINUS | - |


原文地址: https://ruslanspivak.com/lsbasi-part2/
