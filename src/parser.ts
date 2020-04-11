/*

A Recursive descent parser for the following Grammar.


program        -> statement* EOF;
declration     -> funcDecl
                | varDecl 
                | statement;

funcDecl       -> "fun" function;

function       -> IDENTIFIER "(" parameters? ")" block;
parameters     -> IDENTIFIER ("," IDENTIFIER)* ;


varDecl        -> "var" IDENTIFIER ("=" expression)? ";" ;

statement      -> exprStmt
                | printStmt;
                | returnStmt;
                | forStmt;
                | ifStmt;
                | whileStmt;
                | block;


retrunStmt     -> "return" expression? ";"

ifStmt         -> "if" "(" expression ")" statement ("else" statement)? ; 
                
forstmt        ->  "for" "(" ( valDec | exprStmt | ";" )
                      expression? ";"
                      expression? ";" statement ;

WhileStmt      -> "while" "(" expression ")" statement;

block           -> "{" declration* "}";

exprStmt        -> expression ";" ;
printStmt       -> print expression "  ";"  ;

expression     -> assignment;

assignment     -> IDENTIFIER "=" assignment;
                | logic_or;

logic_or       -> logic_and ( "or" logic_and )*;
logic_and      -> equality ( "and" equality )*;


equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
addition       → multiplication ( ( "-" | "+" ) multiplication )* ;
multiplication → unary ( ( "/" | "*" ) unary )* ;


unary          → ( "!" | "-" ) unary | call;

call           ->primary ( "(" arguments ")" )*;

arguments      ->expression ("," expression)*;
      
primary        → NUMBER | STRING | "false" | "true" | "nil"
               | "(" expression ")" | IDENTIFIER ;
     
6 / 3 -1

 */

/*
   Extra care to be given to Error reporting if there is a error in the syntax of th program,
   When an malformed syntax is detected, there are two course of action that has to be taken,
   1) Detect & Report the error
   2) Must not hang & go in an incosistent state,
   3) Minimize cascade Errors by using `Panic mode Recovery`: 
       When an error is encountered by the parser, it may report a no of other errors which may
       not be real errors in the code & is instantly fixed by just fixing this one error
*/


import { Token, TokenTypes } from './lexer';
import { Expr, Binary, Unary, Literal, Grouping, Variable, Assign, Logical, Call } from './Expr';
import { error } from './error';
import { Stmt, Expression, Print, Var, Block, If, While, Return } from './Stmt';
import { equal } from 'assert';
import { throwStatement } from '@babel/types';
import { Funct } from './Stmt';

class ParserError extends Error {
    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}


class Parser {
    current: number = 0;
    tokens: Array<Token>;

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    parse(): Array<Stmt> {

        let stmts: Array<Stmt> = [];
        while (!this.isAtEnd()) {
            stmts.push(this.declaration());
        }
        return stmts;

    }

    // parse function declaration and return a node of type Funct.
    func(kind: string): Funct {
        let name: Token = this.consume(TokenTypes.IDENTIFIER, "expect" + kind + "name.");
        this.consume(TokenTypes.LEFT_PAREN, "Expect '(' after" + kind + "name.");
        let params: Array<Token> = [];
        if (!this.check(TokenTypes.RIGHT_PAREN)) {
            do {
                if (params.length > 255)
                    this.error(this.peek(), "Cannot have more than 255 arguments.")
                params.push(this.consume(TokenTypes.IDENTIFIER, "Expect parameter name."))
            } while (this.match(TokenTypes.COMMA))
        }
        this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after function paramaters.")
        this.consume(TokenTypes.LEFT_BRACE, "expect '{' before" + kind + "body.");
        let body: Array<Stmt> = this.block();
        return new Funct(name, params, body);
    }


    declaration(): Stmt {
        try {
            if (this.match(TokenTypes.FUN)) return this.func("function");
            if (this.match(TokenTypes.VAR)) return this.valDeclration();
            return this.statement();
        }
        catch (error) {
            if (error instanceof ParserError) {
                this.synchronize();
                return null;
            }
        }
    }

    valDeclration() {
        let name: Token = this.consume(TokenTypes.IDENTIFIER, "Expect variable name.");
        let initializer: Expr = null;
        if (this.match(TokenTypes.EQUAL)) {
            initializer = this.expression();
        }
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after variable declaration");

        return new Var(name, initializer);
    }


    block() {
        let statements: Array<Stmt> = [];
        while (!this.check(TokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(TokenTypes.RIGHT_BRACE, "Expect '}' after block.");
        return statements;

    }

    ifStatement() {
        this.consume(TokenTypes.LEFT_PAREN, "Expect '(' after 'if'.");

        let condition: Expr = this.expression();
        this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after 'if' condition.");

        let thenBranch: Stmt = this.statement();


        let elseBranch: Stmt = null;
        if (this.match(TokenTypes.ELSE)) {
            elseBranch = this.statement();
        }

        return new If(condition, thenBranch, elseBranch);



    }

    whileStatement(): Stmt {
        this.consume(TokenTypes.LEFT_PAREN, "Expect '(' after 'while'.");
        let condition: Expr = this.expression();
        this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after 'while condition'.")
        let body: Stmt = this.statement();
        return new While(condition, body)
    }

    forStatement() {
        this.consume(TokenTypes.LEFT_PAREN, "Expect '(' after for.");
        let initializer: Stmt;

        if (this.match(TokenTypes.SEMICOLON)) {
            initializer = null;
        } else if (this.match(TokenTypes.VAR)) {
            initializer = this.valDeclration();

        } else {
            initializer = this.expressionStatement();
        }

        let condition: Expr = null;
        if (!this.check(TokenTypes.SEMICOLON)) {
            condition = this.expression();

        }
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after loop condition.");

        let increment: Expr = null;
        if (!this.check(TokenTypes.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after for clauses.");

        let body: Stmt = this.statement();

        if (increment != null) {
            body = new Block([body, new Expression(increment)])
        }

        if (condition == null) condition = new Literal(true);
        body = new While(condition, body);

        if (initializer != null) {
            body = new Block([initializer, body])
        }


        return body;
    }

    returnStatement(): Stmt {
        let keyword: Token = this.previous();
        let value: Expr = null;
        if (!this.check(TokenTypes.SEMICOLON)) {
            value = this.expression();
        }
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after return value.")
        return new Return(value, keyword);
    }

    statement(): Stmt {

        if (this.match(TokenTypes.RETURN)) {
            return this.returnStatement();
        }
        if (this.match(TokenTypes.FOR)) {
            return this.forStatement();
        }
        if (this.match(TokenTypes.IF)) {
            return this.ifStatement();
        }
        if (this.match(TokenTypes.WHILE)) {
            return this.whileStatement();
        }
        if (this.match(TokenTypes.PRINT)) {
            return this.printStatement()
        }
        if (this.match(TokenTypes.LEFT_BRACE)) {
            return new Block(this.block())
        }


        return this.expressionStatement()
    }


    printStatement(): Stmt {
        let value = this.expression();
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after value.");
        return new Print(value);
    }

    expressionStatement(): Stmt {
        let expr: Expr = this.expression()
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after expression.");
        return new Expression(expr);
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }


    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous()
    }

    peek() {
        return this.tokens[this.current]
    }

    previous() {
        return this.tokens[this.current - 1]
    }

    check(type: TokenTypes) {
        if (this.isAtEnd()) return false;
        return this.peek().type == type
    }



    match(...tokentypes: Array<TokenTypes>) {
        for (let i = 0; i < tokentypes.length; i++) {
            if (this.check(tokentypes[i])) {
                this.advance();
                return true
            }
        }
        return false;
    }


    and() {

        let expr: Expr = this.equality();
        while (this.match(TokenTypes.AND)) {
            let op: Token = this.previous();
            let right: Expr = this.equality();
            expr = new Logical(expr, op, right);
        }
        return expr;

    }


    or(): Expr {
        let expr: Expr = this.and();
        while (this.match(TokenTypes.OR)) {
            let op: Token = this.previous();
            let right: Expr = this.and();
            expr = new Logical(expr, op, right)
        }
        return expr;
    }

    assignment(): Expr {
        let expr: Expr = this.or();
        if (this.match(TokenTypes.EQUAL)) {
            let equals: Token = this.previous();
            let value: Expr = this.assignment();

            if (expr instanceof Variable) {
                let name: Token = expr.name;
                return new Assign(name, value);
            }
            this.error(equals, "Invalid Assignment target");

        }
        return expr;

    }

    expression(): Expr {

        return this.assignment();
    }

    error(token: Token, message: string): ParserError {
        error(token, message);
        return new ParserError();
    }

    synchronize() {
        this.advance()
        while (!this.isAtEnd()) {
            if (this.previous().type == TokenTypes.SEMICOLON) return;

            switch (this.peek().type) {
                case TokenTypes.CLASS:
                case TokenTypes.FUN:
                case TokenTypes.VAR:
                case TokenTypes.FOR:
                case TokenTypes.IF:
                case TokenTypes.WHILE:
                case TokenTypes.PRINT:
                case TokenTypes.RETURN:
                    return;
            }
            this.advance();
        }
    }

    consume(type: TokenTypes, message: string) {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message)
    }

    primary() {

        if (this.match(TokenTypes.FALSE)) return new Literal(false);
        if (this.match(TokenTypes.TRUE)) return new Literal(true);
        if (this.match(TokenTypes.NIL)) return new Literal(null);

        if (this.match(TokenTypes.NUMBER, TokenTypes.STRING)) {
            return new Literal(this.previous().literal);
        }

        if (this.match(TokenTypes.LEFT_PAREN)) {
            let expr: Expr = this.expression();
            this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }

        if (this.match(TokenTypes.IDENTIFIER)) {
            return new Variable(this.previous());
        }

        throw this.error(this.peek(), "Expect Expression.");

    }

    finishCall(callee: Expr): Expr {
        let args: Array<Expr> = [];
        if (!this.check(TokenTypes.RIGHT_PAREN)) {
            do {
                // cant hvae more than 255 arguments? you ask why? i am not yet experienced to answer this..
                if (args.length >= 255) {
                    this.error(this.peek(), "Cannot have more than 255 Arguments.")
                }
                args.push(this.expression())
            } while (this.match(TokenTypes.COMMA))
        }

        let paren: Token = this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after function arguments.")
        return new Call(callee, paren, args)

    }


    call(): Expr {
        let expr: Expr = this.primary();
        while (true) {
            if (this.match(TokenTypes.LEFT_PAREN)) {
                expr = this.finishCall(expr);

            }
            else {
                break;
            }
        }
        return expr;
    }


    unary() {
        if (this.match(TokenTypes.BANG, TokenTypes.MINUS)) {
            let operator: Token = this.previous();
            let right: Expr = this.unary();
            return new Unary(operator, right)
        }
        return this.call();
    }

    multiplication() {
        let expr = this.unary()
        while (this.match(TokenTypes.SLASH, TokenTypes.STAR)) {
            let operator: Token = this.previous()
            let right: Expr = this.unary()
            expr = new Binary(expr, operator, right)
        }
        return expr;
    }

    addition() {
        let expr: Expr = this.multiplication();
        while (this.match(TokenTypes.MINUS, TokenTypes.PLUS)) {
            let operator: Token = this.previous();
            let right: Expr = this.multiplication()
            expr = new Binary(expr, operator, right)
        }
        return expr;
    }

    comparison() {
        let expr: Expr = this.addition()
        while (this.match(TokenTypes.GREATER, TokenTypes.GREATER_EQUAL, TokenTypes.LESS, TokenTypes.LESS_EQUAL)) {
            let operator: Token = this.previous();
            let right: Expr = this.addition();

            expr = new Binary(expr, operator, right)

        }


        return expr;
    }

    equality() {
        let expr: Expr = this.comparison();
        while (this.match(TokenTypes.BANG_EQUAL, TokenTypes.EQUAL_EQUAL)) {
            let operator: Token = this.previous();
            let right: Expr = this.comparison();
            expr = new Binary(expr, operator, right)
        }

        return expr;
    }
}

export {
    Parser
}
