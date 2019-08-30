# 构建一个简单的解释器-semantic analysis
## 什么是 语义分析 (semantic analysis)?
使用抽象语法树和符号表中的信息来见检查源程序是否和语言定义的语义一致。比如检查一个变量在使用之前是否声明了变量类型，赋值的时候是否赋值与该变量相符合的类型值。

## 关于 Pascal一些语义规则；
* 变量在使用之前必须声明变量类型
* 在算术表达式引用类型时必须有相比配的类型
* 不应该有重复的声明
* 调用过程中的名称引用必须引用实际声明的过程
* 过程调用必须具有正确的参数数量，并且参数的类型必须与过程声明中的形式参数匹配;

一些语义错误的例子


    program Main;
    var x : integer;

      begin
          x := y;
      end.

可以看到上面的代码中，在语法上是正确的，也可以生成正确的抽象语法树，这符合之前定义的语法序列。但是这里的y 他是没有定义的。

## 如何在代码中检查变量没有声明的错误？
* 遍历所有的变量声明
* 为每个声明的变量收集必要的变量声明信息
* 把收集到的信息存储起来以便未来通过变量的名字作为Key来引用相关的声明信息
* 当你碰到一个诸如 x := x + y 这样的赋值语句时，可以通过变量的名字去储存的声明信息里查找相对应的变量声明信息。如果没有对应的声明信心，则抛出一个语义错误；

### 如何储存变量的声明信息
我们可以创建一个symbolTable类，他负责储存和按symbol的名字查找相对应的symbol

    class SymbolTable {
      constructor() {
        this._symbols = {};
        this._initBuitinType();
      }

      _initBuitinType() {
        //初始化内置变量
        this.inset(new BuiltinTypeSymbol('INTEGER'));
        this.inset(new BuiltinTypeSymbol('REAL'));
      }

      inset(obj) {
        this._symbols[obj.name] = obj;
      }

      lookup(name) {
        return this._symbols[name];
      }
    }
### 如何变量AST检查和创建变量信息；
跟之前一样可以创建一个专门遍历变量的vistor；

    class SemanticAnalyzer extends NodeVisitor {
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
        this.visit(node.left);
        this.visit(node.right);
      }
      visit_Var(node) {
        /**
        * 解析Var node;
        * 负责检查变量在使用前是否声明；
        * 
        */
        const var_name = node.value;
        const symbol = this.symtab.lookup(var_name);
        if(!symbol) {
          throw new ReferenceError(`${var_name} is not defined`)
        }
      }

      visit_NoOp(node) {}
      visit_Num(node) {}

      visit_VarDecl(node) {
        /**
        * 解析 VarDecl Node.
        * 负责插入变量声明信息到symbol tabals;
        * 负责检查是否有重复声明的变量；
        */
        const typeName = node.type_node.value;
        const typeSymbol = this.symtab.lookup(typeName);
        const varName = node.var_node.value;
        if(this.symtab.lookup(varName)) {
          //
          throw new ReferenceError(`${varName} have alread declarated`)
        }
        const varSymbol = new VarSymbol(varName,typeSymbol);
        this.symtab.inset(varSymbol);
      }
    }











[完整代码](https://github.com/Afu0402/notes/blob/master/simple-interpreter/part13/interpreter.js)







    






















