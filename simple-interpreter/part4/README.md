# 构建一个简单的解释器 （四）

## Grammar
语法由一系列的规则组成。例如  
expr: factor ((MUL | DIV) factor) *  
factor: INTEGER   

规则由一个非终结符(称为产生的头部或左侧)、一个冒号和一系列终结符和/或非终结符(称为产生的身体或右侧)组成:  

| head/left-head side | colon | body/right-head side 
|-----|-------| --------------- |
| expr | : | factor ((MUL \| DIV) factor) * |
| factor | : | INTEGER |

在上面的语法中，像MUL，DIV，INTEGER这种token称为终结点（terminals）。像变量 expr, factor称为非终结点（non-terminals）。非终结点（non-terminals）通常由一系列的 终结点（terminals） 和或 非终结点（non-terminals）组成。

在下列规则中最左侧的非终结符号 *expr*（non-terminal symbol)称为起始符号（start symbol).  
    
    //（non-terminal symbol） expr
    expr: factor ((MUL | DIV) factor) * 
    factor: INTEGER

上面语法可以理解为 一个expr 规则 由一个 因素(factor) 后跟着一个 乘法或者除法操作 再跟着令一个除法或者乘法操作。再跟着一个因素（factor）...以此类推 （fator 就是一个INTEGER）

上面语法规则里的各个符号的意思如下（和正则表达式差不多）：  

* **|** - 或的意思。所以(MUL | DIV) 表示可以是乘法或者除法
* **（...）** - 表示一个分组  
* **(...)*** -  匹配分组的内容和一次或多次  

一个语法通过解释一门语言可以形成什么语句来定义他。
比如使用语法导出一个算术表达式：从起始符号 expr 开始，不断地将非终结符号使用一组规则进行替换，直到整个表达式中只包含终结符号。通过不断重复这样的过程得到的语句集合就形成了这个语法定义的语言。  
如果一个语法无法推导出对应的算术表达式，那就表示该语法不支持这种表达式。当解析器尝试解析该表达式时就会抛出一个语法错误 （syntax error)。

下面列出了将一个语法表示翻译成代码的基本步骤，根据这些步骤，你可以方便地将一个语法表示翻译解释器代码:  
1. 将语法表示中定义的每一条规则 R，翻译成一个方法, 而对这个规则的应用则翻译成一个方法调用: R().根据相似的方法，将规则的定义翻译成方法的实现
2. 将(a1 | a2 |aN) 翻译成 if--elif-else 语句
3. (...)* 翻译成 while 语句循环一次或多次
4. 对每个token T的引用翻译调用一个方法 eat,eat(T)。 eat的方法是如果传进去的T 和 current_token 一样，那就消耗一个token并将current_token指向一个新的token T

在之前定义的语法里有2个规则分别是 **expr** 和  **factro** 。
遵循上面提到的步骤1. 需要创建一个叫 “factor”的方法。该方法主要目的是解析一个INTEGER的值。按上面的步骤4. 对token的引用改为调用 eat。代码如下： 

    factor() {
      this.eat(INTEGER);
    }

规则 expr 变成一个方法 expr。该方法的首先 引用一个 factor (对factor的引用其实就是调用factor()), (...)* 变成一个while循环。 （MUL| DIV） 变成一个 if...else语句，结合起来就是如下代码：

    expr () {
      this.factor();

      while([MUL,DIV].includes(this.current_token.type)) {
        token = this.current_token;
        if(token.type === MUL) {
          this.eat(MUL);
          this.factor();
        } else if (token.type === DIV) {
          this.eat(DIV);
          this.factor();
        }
      }
    }



完整代码：

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










  