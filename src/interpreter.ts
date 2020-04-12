import { ExprVisitor, Expr, Literal, Grouping, Unary, Binary, Variable, Assign, Logical, Call } from './Expr';
import { StmtVisitor, Expression, Print, Stmt, Var, Block, If, While, Return } from './Stmt';
import { Token, TokenTypes } from './lexer';
import { error } from './error';
import { Environment } from './Environment';
import { FerrousCallable } from './FerrousCallable';
import { Clock } from './nativeFunctions';
import { FerrousFunction } from './FerrousFunction';
import { Funct } from './Stmt';
import { RetrunException } from './ReturnException';


class RuntimeError extends Error {
    token: Token;
    constructor(token: Token, message?: string) {
        super(message)
        this.token = token;
        Object.setPrototypeOf(this, new.target.prototype)
    }
}


function runtimeError(error: RuntimeError) {
    console.log(error.message + '\n[Line ' + error.token.line + "]");
}


class Interpreter implements ExprVisitor, StmtVisitor {

    globals: Environment = new Environment();
    env: Environment = this.globals;

    constructor() {
        this.globals.define("clock", new Clock())
    }


    interpret(stmts: Array<Stmt>) {
        try {
            stmts.forEach(stmt => {

                this.execute(stmt);

            })
        } catch (error) {
            if (error instanceof RuntimeError) {
                runtimeError(error)
            }
        }

    }

    execute(stmt: Stmt) {

        stmt.accept(this);

    }


    evaluate(expr: Expr) {
        return expr.accept(this)
    }


    isTruthy(object: Object) {
        if (object === null) return false
        if (typeof object == "boolean") return Boolean(object);
        return true

    }

    isEqual(a: Object, b: Object) {
        if (a === null && b === null) return true;
        if (a == null) return false;
        //check for the type and value for equality
        return a === b
    }

    checkNumberOperand(operator: Token, operand: Object) {
        if (typeof operand === "number") return;
        throw new RuntimeError(operator, `Operand must be a number`)
    }

    checkNumberOperands(operator: Token, left: Object, right: Object) {
        if (typeof left === "number" && typeof right === "number") return;
        throw new RuntimeError(operator, `Operands must be a numbers `)
    }


    visitBinaryExpr(expr: Binary) {
        let left: Object = this.evaluate(expr.left)
        let right: Object = this.evaluate(expr.right)

        switch (expr.operator.type) {

            case TokenTypes.MINUS:
                this.checkNumberOperand(expr.operator, right)
                return Number(left) - Number(right);

            case TokenTypes.SLASH:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) / Number(right);

            case TokenTypes.STAR:
                this.checkNumberOperands(expr.operator, left, right)
                return Number(left) * Number(right);

            case TokenTypes.PLUS:

                // console.log(left, right)
                if (typeof left == "number" && typeof right == "number")
                    return Number(left) + Number(right)
                if (typeof left == "string" && typeof right == "string")
                    return String(left) + String(right)

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

    visitGroupingExpr(expr: Grouping) {
        return this.evaluate(expr.expression)

    }

    visitLiteralExpr(expr: Literal) {
        return expr.Value

    }


    visitUnaryExpr(expr: Unary) {
        let right: Object = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenTypes.MINUS:
                return -1 * Number(right)
            case TokenTypes.BANG:
                return !this.isTruthy(right)
        }
        // Unreachable
        return null;
    }

    visitExpressionStmt(stm: Expression) {
        this.evaluate(stm.expression);
        return null;
    }

    visitPrintStmt(stm: Print) {
        let value: Object = this.evaluate(stm.expression)
        console.log(value);
        return null;
    }

    visitVarStmt(stmt: Var) {
        let value: Object = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.env.define(stmt.name.lexeme, value);
        return null;
    }

    visitVariableExpr(expr: Variable) {

        return this.env.get(expr.name);
    }



    visitAssignExpr(expr: Assign) {
        let value: Object = this.evaluate(expr.value);
        this.env.assign(expr.name.lexeme, value);
        return value;
    }

    executeBlock(stmts: Array<Stmt>, environment: Environment) {
        let previous: Environment = this.env;

        try {
            this.env = environment;
            stmts.forEach(stmt => {
                this.execute(stmt)
            })

        } catch (error) {
            if (!(error instanceof RetrunException)) {
                console.log("🔥🔥🔥 Error 🔥 happened")
                console.log(error)
            }
            else {

                throw error

            }
        }
        finally {
            this.env = previous;
        }

    }

    visitBlockStmt(stmt: Block) {
        this.executeBlock(stmt.statements,
            /*Pass the ref of  enclosing environment to the  new Environment*/
            new Environment(this.env)
        )
        return null;
    }

    visitIfStmt(stm: If) {
        if (this.isTruthy(this.evaluate(stm.condition))) {
            this.execute(stm.thenBranch)
        }
        else {
            if (stm.thenBranch != null) {
                this.execute(stm.elseBranch);
            }
        }

        return null;

    }

    visitLogicalExpr(expr: Logical) {
        let left: Object = this.evaluate(expr.left);
        if (expr.operator.type == TokenTypes.OR) {
            if (this.isTruthy(left)) return left;

        } else {
            if (!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);

    }

    visitWhileStmt(stmt: While) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {

            this.execute(stmt.body);
        }
        return null;
    }

    // Define how to evaluate a function call Node.
    visitCallExpr(expr: Call) {
        let callee: Object = this.evaluate(expr.callee);
        let args: Array<Expr> = [];

        expr.args.forEach((arg) => {
            args.push(this.evaluate(arg));
        })

        // TODO: might need to work on this , 
        // check instance compability with FerrousCallable instead of FerrousFunction.



        // if (!(callee instanceof FerrousCallable)) {
        //     throw new RuntimeError(expr.paren, "Can only call functions and classes.")
        // }


        let func: FerrousCallable = <FerrousCallable>callee;

        // Validate for function arity
        if (args.length != func.arity()) {
            throw new RuntimeError(expr.paren, "🦠Expected " +
                func.arity() + " arguments but got " +
                args.length + ".");
        }

        return func.call(this, args)
    }

    // Define how to evaluate a Funct Node.
    // Set the function name to corresponding Funct Object in the env.
    visitFunctStmt(stmt: Funct) {
        let fc: FerrousFunction = new FerrousFunction(stmt);
        this.env.define(stmt.name.lexeme, fc);
        return null;
    }

    visitReturnStmt(stmt: Return) {
        let value: Object = null;
        if (stmt.value != null) {
            value = this.evaluate(stmt.value);
        }

        // use exception to  unwind the stack.
        // retunr statement could be called at any depth during fucntion execution.

        throw new RetrunException(value);
    }

}

export {
    Interpreter
}