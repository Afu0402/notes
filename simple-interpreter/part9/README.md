# 构建一个简单的解释器-扩展解释器增加识别一元操作符 （八）
## 扩展语法支持一元操作符
一元操作比如 -8， +9， - - -8。 2+ -1；一元操作符比其他二元操作符的优先级要高。所以要优先计算一元操作符，落实到语法就是  
factor: (PLUS|MINUS)factor | INTEGER | LPAREN | RPAREN;
## 添加一个代表一元操作符的AST UnaryOp

    class UnaryOp {
      constructor(op,expr) {
        this.token = this.op = op;
        this.expr = expr
      }
    }

根据上面语法，主要是在factor方法里添加对一元操作符的处理，因为优先级较高关系所以放在第一位。 优先判断是否是一元操作符。

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
    }
  }

在interpreter里增加对UnaryOp的处理

    visit_UnaryOp(node){
      if(node.op.type === PLUS) {
        return +this.visit(node.expr)
      }else if(node.op.type === MINUS) {
        return -this.visit(node.expr)
      }
    }
