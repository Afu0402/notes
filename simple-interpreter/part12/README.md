# 构建一个简单的解释器-Procedure declaration
## 什么是 Procedure declaration?
Procedure declaration 可以理解为 Pascal的一个子过程。该过程包含一个名字表示该procedure的名字，和一个代码块.  

    PROGRAM Part12;
    VAR
    a : INTEGER;

        PROCEDURE P1;
            VAR
            a : REAL;
            k : INTEGER;

            PROCEDURE P2;
                VAR
                    a, z : INTEGER;
                BEGIN {P2}
                    z := 777;
                END;  {P2}

        BEGIN {P1}

        END;  {P1}

    BEGIN {Part12}
    a := 10;
    END.  {Part12}


根据上面的代码，可以更新一下之前 declarations的语法：

    declarations: VAR (variable_declaration SEMI) + | （PROCEDURE ID SEMI blcok SEMI）* | empty

首先添加一个新的token名和一个新的保留字

    const PROCEDURE = 'PROCEDURE';
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

然后跟新一下declataions方法：  

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


[完整代码](https://github.com/Afu0402/notes/blob/master/simple-interpreter/part12/interpreter.js)







    






















