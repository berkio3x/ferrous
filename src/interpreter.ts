import {ExprVisitor, Expr, Literal, Grouping, Unary, Binary, Variable, Assign} from './Expr';
import {StmtVisitor, Expression, Print, Stmt, Var} from './Stmt';
import { Token, TokenTypes } from './lexer';
import {error} from './error';
import {Environment} from './Environment';

class RuntimeError extends Error{
    token:Token;
    constructor(token:Token ,message?:string){
        super(message)
        this.token = token;
        Object.setPrototypeOf(this, new.target.prototype)
    }
}


function runtimeError(error:RuntimeError){
    console.log(error.message+'\n[Line '+ error.token.line+"]");
}


class Interpreter implements ExprVisitor, StmtVisitor{

     env:Environment = new Environment();

    interpret(stmts:Array<Stmt>){
        try{
            stmts.forEach(stmt=>{

                this.execute(stmt); 

            })
        }catch(error){
            if (error instanceof RuntimeError){
                runtimeError(error)
            }
        }

    }

    execute(stmt:Stmt){
        stmt.accept(this);

    }


    evaluate(expr:Expr) {
        return expr.accept(this)
    }


    isTruthy(object:Object) {
        if(object === null) return false
        if(typeof object == "boolean") return Boolean(object);
        return true

    }

    isEqual(a:Object, b:Object){
        if(a === null && b === null) return true;
        if(a ==  null) return false;
        //check for the type and value for equality
        return a === b
    }

    checkNumberOperand(operator:Token, operand:Object){
        if( typeof operator === "number") return ;
        throw new RuntimeError(operator,`Operand must be a number`)
    }

    checkNumberOperands(operator:Token, left:Object, right:Object){
        if(typeof left === "number" && typeof right === "number") return;
        throw new RuntimeError(operator,`Operands must be a numbers `)
    }

    visitBinaryExpr(expr:Binary){
        let left:Object = this.evaluate(expr.left)
        let right:Object = this.evaluate(expr.right)

        switch(expr.operator.type){

            case TokenTypes.MINUS:
                this.checkNumberOperand(expr.operator, right)
                return  Number(left) - Number(right);
            
            case TokenTypes.SLASH:
                this.checkNumberOperands(expr.operator ,left, right)
                return Number(left) / Number(right);

            case TokenTypes.STAR:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) * Number(right);

            case TokenTypes.PLUS:
                if (typeof left == "number" && typeof right == "number")
                    return Number(left) + Number(right)
                if (typeof left == "string" && typeof right == "string")
                    return String(left)  + String(right)

                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings")

            case TokenTypes.GREATER:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) > Number(right)

            case TokenTypes.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) >= Number(right)

            case TokenTypes.LESS:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) < Number(right)

            case TokenTypes.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) <= Number(right)

            case TokenTypes.BANG_EQUAL:
                return !this.isEqual(left, right)
            case TokenTypes.EQUAL:
                return this.isEqual(left, right)
                
            
        }
        //Unreachable 
        return null
        

    }


    visitGroupingExpr(expr:Grouping){
        return this.evaluate(expr.expression)

    }

    visitLiteralExpr(expr:Literal){
        return expr.Value

    }


    visitUnaryExpr(expr:Unary){
        let right:Object = this.evaluate(expr.right);
        switch(expr.operator.type){
            case TokenTypes.MINUS:
                return -1*Number(right)
            case TokenTypes.BANG:
                return !this.isTruthy(right)
        }
        // Unreachable
        return null;
    }

    visitExpressionStmt(stm:Expression){
        this.evaluate(stm.expression);
        return null;
    }

    visitPrintStmt(stm:Print){
        let value:Object = this.evaluate(stm.expression)
        console.log(value);
        return null;
    }

    visitVarStmt(stmt:Var){
        let value:Object = null;
        if(stmt.initializer != null){
            value = this.evaluate(stmt.initializer);
        }
        this.env.define(stmt.name.lexeme, value);
        return null;
    }

    visitVariableExpr(expr:Variable){
        return this.env.get(expr.name);
    }

    visitAssignExpr(expr:Assign){
        let value:Object = this.evaluate(expr.value);
        this.env.assign(expr.name.lexeme, value);
        return value;
    }

  
}

export {
    Interpreter
}