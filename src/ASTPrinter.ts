import {ExprVisitor, Expr} from './Expr';
import {Binary, Unary, Literal, Grouping} from './Expr';
import { Token, TokenTypes } from './lexer';


class ASTPrinter implements ExprVisitor{

    print(expr: Expr){
        return expr.accept(this)
    }
    parenthesize(name: string, ...exprs: Expr[]){
        let output: string = '' ;
        output = output+ `(${name}`;

        exprs.forEach((expr)=>{
            output = output + " ";
            output = output + expr.accept(this);

        })
        output = output + ")";
        return output

}

    visitBinaryExpr(expr: Binary){
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr: Grouping){
        return this.parenthesize("group", expr.expression)
    }

    visitLiteralExpr(expr: Literal){
        return expr.Value;

    }

    visitUnaryExpr(expr: Unary){
        return this.parenthesize(expr.operator.lexeme, expr.right);

    }
}


export {ASTPrinter}