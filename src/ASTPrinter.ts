import {Visitor, Expr} from './Expr';
import {Binary, Unary, Literal, Grouping} from './Expr';


function parenthesize(name: string, ...expr: Expr[]){

}

class ASTPrinter implements Visitor{

    visitBinaryExpr(expr: Binary){
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr: Grouping){

    }

    visitLiteralExpr(expr: Literal){


    }


    visitUnaryExpr(expr: Unary){

    }
    

}