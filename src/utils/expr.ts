abstract class Expr{}
class Binary    Extends Expr {
 left: Expr 
 operator: TokenTypes
 right: Expr
constructor( left:Expr , operator:TokenTypes, right:Expr){

	this.left = left
	this.operator = operator
	this.right = right


}

class Grouping  Extends Expr {
 expression: Expr
constructor( expression:Expr){

	this.expression = expression


}

class Literal   Extends Expr {
 Value: Object
constructor( Value:Object){

	this.Value = Value


}

class Unary     Extends Expr {
 operator: TokenTypes
 right:  Expr
constructor( operator:TokenTypes, right: Expr){

	this.operator = operator
	this.right = right


}

