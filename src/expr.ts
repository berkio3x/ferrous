
        

/* 
This is an auto generated file by using utils/exprGen.ts utility cli program of Ferrous.
(っ◔◡◔)っ ♥ ast ♥
*/
        


interface Expr{

    accept(vv: Visitor): any;
}
interface Visitor {

    visitBinaryExpr (vs: Binary ):any ;
    visitGroupingExpr (vs: Grouping ):any ;
    visitLiteralExpr (vs: Literal ):any ;
    visitUnaryExpr (vs: Unary ):any ;
}

class Binary implements Expr {

     left: Expr ;
     operator: TokenTypes;
     right: Expr;

    constructor( left:Expr , operator:TokenTypes, right:Expr){

		this.left = left;
		this.operator = operator;
		this.right = right;

    }

    accept(vv: Visitor) {
        vv.visitBinaryExpr(this);
    }

}

class Grouping implements Expr {

     expression: Expr;

    constructor( expression:Expr){

		this.expression = expression;

    }

    accept(vv: Visitor) {
        vv.visitGroupingExpr(this);
    }

}

class Literal implements Expr {

     Value: Object;

    constructor( Value:Object){

		this.Value = Value;

    }

    accept(vv: Visitor) {
        vv.visitLiteralExpr(this);
    }

}

class Unary implements Expr {

     operator: TokenTypes;
     right:  Expr;

    constructor( operator:TokenTypes, right: Expr){

		this.operator = operator;
		this.right = right;

    }

    accept(vv: Visitor) {
        vv.visitUnaryExpr(this);
    }

}

export {
Binary,
Grouping,
Literal,
Unary,
}