
        

/* 
This is an auto generated file by using utils/exprGen.ts utility cli program of Ferrous.
(っ◔◡◔)っ ♥ ast ♥
*/
        


import {Token} from './lexer';

interface Expr{

    accept(vv: ExprVisitor): any;
}

interface ExprVisitor {

    visitBinaryExpr (vs: Binary ):any ;
    visitGroupingExpr (vs: Grouping ):any ;
    visitLiteralExpr (vs: Literal ):any ;
    visitUnaryExpr (vs: Unary ):any ;
}

class Binary implements Expr {

     left: Expr ;
     operator: Token;
     right: Expr;

    constructor( left:Expr , operator:Token, right:Expr){

		this.left = left;
		this.operator = operator;
		this.right = right;

    }

    accept(vv: ExprVisitor) {
        return vv.visitBinaryExpr(this);
    }

}

class Grouping implements Expr {

     expression: Expr;

    constructor( expression:Expr){

		this.expression = expression;

    }

    accept(vv: ExprVisitor) {
        return vv.visitGroupingExpr(this);
    }

}

class Literal implements Expr {

     Value: Object;

    constructor( Value:Object){

		this.Value = Value;

    }

    accept(vv: ExprVisitor) {
        return vv.visitLiteralExpr(this);
    }

}

class Unary implements Expr {

     operator: Token;
     right:  Expr;

    constructor( operator:Token, right: Expr){

		this.operator = operator;
		this.right = right;

    }

    accept(vv: ExprVisitor) {
        return vv.visitUnaryExpr(this);
    }

}

export {
  Binary,
  Grouping,
  Literal,
  Unary,
  ExprVisitor,
  Expr
}