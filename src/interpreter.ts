import {Visitor, Expr, Literal, Grouping, Unary, Binary} from '../src/Expr';
import { Token, TokenTypes } from './lexer';


class Interpreter implements Visitor{

    interpret(expression:Expr){
        try{
            let value:Object = this.evaluate(expression)
            console.log(value)
        }
        catch(error){
            console.log(`[Interpreter] : Error Occure while evaluating source.\n${error}`)
        }

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
        throw new Error(`${operator}: Operand must be a number`)
    }

    checkNumberOperands(operator:Token, left:Object, right:Object){
        if(typeof left === "number" && typeof right === "number") return;
        throw new Error(`${operator}: Operands must be a numbers `)
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

                throw new Error("Operands must be two numbers or two strings")

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

  
}

export {
    Interpreter
}