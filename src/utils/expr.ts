

/* This is an auto generated file by using utils/exprGen.ts utility cli program */


abstract class Expr{}
interface Visitor {

    visitBinaryExpr (vs: Binary ):any ;
    visitGroupingExpr (vs: Grouping ):any ;
    visitLiteralExpr (vs: Literal ):any ;
    visitUnaryExpr (vs: Unary ):any ;
}

class Binary Extends Expr {

     left: Expr 
     operator: TokenTypes
     right: Expr

    constructor( left:Expr , operator:TokenTypes, right:Expr){

		this.left = left
		this.operator = operator
		this.right = right

    }

}

class Grouping Extends Expr {

     expression: Expr

    constructor( expression:Expr){

		this.expression = expression

    }

}

class Literal Extends Expr {

     Value: Object

    constructor( Value:Object){

		this.Value = Value

    }

}

class Unary Extends Expr {

     operator: TokenTypes
     right:  Expr

    constructor( operator:TokenTypes, right: Expr){

		this.operator = operator
		this.right = right

    }

}

