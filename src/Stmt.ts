
        

/* 
This is an auto generated file by using utils/exprGen.ts utility cli program of Ferrous.
(っ◔◡◔)っ ♥ ast ♥
*/
        


import {Token} from './lexer';

import {Expr} from './Expr'
interface Stmt{

    accept(vv: StmtVisitor): any;
}
interface StmtVisitor {

    visitExpressionStmt (vs: Expression ):any ;
    visitPrintStmt (vs: Print ):any ;
    visitVarStmt (vs: Var ):any ;
}

class Expression implements Stmt {

    expression: Expr;

    constructor(expression:Expr){

		this.expression = expression;

    }

    accept(vv: StmtVisitor) {
        return vv.visitExpressionStmt(this);
    }

}

class Print implements Stmt {

    expression: Expr;

    constructor(expression:Expr){

		this.expression = expression;

    }

    accept(vv: StmtVisitor) {
        return vv.visitPrintStmt(this);
    }

}

class Var implements Stmt {

    name: Token;
     initializer: Expr;

    constructor(name:Token, initializer:Expr){

		this.name = name;
		this.initializer = initializer;

    }

    accept(vv: StmtVisitor) {
        return vv.visitVarStmt(this);
    }

}

export {
  Expression,
  Print,
  Var,
  StmtVisitor,
  Stmt
}