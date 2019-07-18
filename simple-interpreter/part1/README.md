# 构建一个简单的解释器 （一）。

> “If you don’t know how compilers work, then you don’t know how computers work. If you’re not 100% sure whether you know how compilers work, then you don’t know how they work.” — Steve Yegge

## 什么是编译器 （compliler)？
如果翻译器将源程序翻译成机器语言，那它就是编译器。
## 什么是解释器 （interpreter）？
如果翻译器直接执行源程序代码没有转成机器语言，那它就是解释器。
## 什么是词法分析 （lexical analysis)？
将字符流组织成为有意义的词素(lexeme)的序列;执行这个任务的就是 词法分析程序（lexical analyzer）
## 什么是token?
百科：词法分析是计算机科学中将字符序列转换为标记（token）序列的过程。  
在本章的计算机解释器的代码中，把通过词法分析器(lexical analyzer)字符逐个解析为一个个token.例如输入“3+5”，第一个字符就是 3，它将生成一个token, token是一个简单的对象有两个属性一个是 type 它的值是 'INTEGER'。另一个属性是value 它的值是 ‘3’.

    
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

原文地址: https://ruslanspivak.com/lsbasi-part1/


