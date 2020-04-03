/*

A Recursive descent parser for the following Grammar.
program        -> statement* EOF;
decls          -> varDecl 
                | statement;

varDecl        -> "var" IDENTIFIER ("=" expression)? ";" ;

statement      -> exprStmt
                | printStmt;

exprStmt        -> expression ";" ;
printStmt       -> print expression "  ";"  ;

expression     -> assignment;

assignment     -> IDENTIFIER "=" assignment;
            |   | equality;

equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
addition       → multiplication ( ( "-" | "+" ) multiplication )* ;
multiplication → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
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


import {Token, TokenTypes} from './lexer';
import {Expr, Binary, Unary, Literal, Grouping, Variable, Assign} from './Expr';
import {error} from './error';
import {Stmt, Expression, Print, Var} from './Stmt';
import { equal } from 'assert';

class ParserError extends Error{
    constructor(message?:string ){
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}


class Parser {
    current: number = 0;
    tokens: Array<Token>;

    constructor(tokens: Array<Token>){
        this.tokens = tokens;
    }

    parse():Array<Stmt> {
        
        let stmts : Array<Stmt>=[];
        while(!this.isAtEnd()){
            stmts.push(this.declaration());
        }
        return stmts; 

    }

    declaration():Stmt{
        try{
            if (this.match(TokenTypes.VAR)) return this.valDeclration();
            return this.statement();
        }
        catch(error){
            if (error instanceof ParserError){
                this.synchronize();
                return null;
            }
        }
    }

    valDeclration(){
        let name:Token = this.consume(TokenTypes.IDENTIFIER, "Expect variable name.");
        let initializer:Expr = null;
        if(this.match(TokenTypes.EQUAL)){
            initializer = this.expression();
        }
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after variable declaration");
        
        return new Var(name, initializer);
    }



    statement():Stmt{
        if(this.match(TokenTypes.PRINT)) {
            return this.printStatement()
        }
        return this.expressionStatement()
    }


    printStatement():Stmt{
        let value = this.expression();
        this.consume(TokenTypes.SEMICOLON,"Expect ';' after value.");
        return new Print(value);
    }

    expressionStatement():Stmt{
        let expr:Expr = this.expression()
        this.consume(TokenTypes.SEMICOLON, "Expect ';' after expression.");
        return new Expression(expr);
    }

    isAtEnd(){
        return this.current >= this.tokens.length;
    }


    advance(){
        if (!this.isAtEnd()) this.current++;
        return this.previous()
    }

    peek(){
        return this.tokens[this.current]
    }

    previous(){
        return this.tokens[this.current - 1]
    }

    check(type:TokenTypes){
        if (this.isAtEnd()) return false;
        return this.peek().type == type
    }

    match(...tokentypes:Array<TokenTypes>){
        for(let i =0 ;i < tokentypes.length ;i ++){
            if (this.check(tokentypes[i])){
                this.advance();
                return true
            }
        }
        return false;
    }


    assignment(): Expr {
        let expr:Expr = this.equality();
        if(this.match(TokenTypes.EQUAL)){
            let equals:Token = this.previous();
            let value:Expr  = this.assignment();
            
            if(expr instanceof Variable) {
                let name:Token = expr.name;
                return new Assign(name, value);
            }
            this.error(equals,"Invalid Assignment target");

        }
        return expr;

    }

    expression(): Expr {

        return this.assignment();
    }

    error(token:Token, message:string) : ParserError{ 
        error(token, message);
        return new ParserError();
    }

    synchronize(){
        this.advance()
        while(!this.isAtEnd()){
            if(this.previous().type == TokenTypes.SEMICOLON) return;

            switch(this.peek().type){
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

    consume(type:TokenTypes, message:string){
        if(this.check(type)) return this.advance();
        throw this.error(this.peek()  , message)
    }

    primary(){
        if(this.match(TokenTypes.FALSE)) return new Literal(false);
        if(this.match(TokenTypes.TRUE)) return new Literal(true);
        if(this.match(TokenTypes.NIL)) return new Literal(null);

        if(this.match(TokenTypes.NUMBER, TokenTypes.STRING))
             return new Literal(this.previous().literal);

        if(this.match(TokenTypes.LEFT_PAREN)) {
            let expr:Expr = this.expression();                            
            this.consume(TokenTypes.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);   
        }

        if (this.match(TokenTypes.IDENTIFIER)){
            return new Variable(this.previous());
        }

        throw this.error(this.peek(), "Expect Expression.");

    }

    unary(){

        if (this.match(TokenTypes.BANG, TokenTypes.MINUS)){
            let operator:Token = this.previous();
            let right:Expr = this.unary();
            return new Unary(operator, right)
        }
        return this.primary()
    }

    multiplication(){
        let expr = this.unary()
        while(this.match(TokenTypes.SLASH, TokenTypes.STAR)){
            let operator:Token = this.previous()
            let right:Expr = this.unary()
            expr = new Binary(expr, operator, right)
        }
        return expr;
    }

    addition(){
        let expr:Expr = this.multiplication();
        while(this.match(TokenTypes.MINUS, TokenTypes.PLUS)){
            let operator:Token = this.previous();
            let right:Expr = this.multiplication()
            expr = new Binary(expr, operator, right)
        }

        return expr;
    }

    comparison(){
        let expr:Expr = this.addition()
        while(this.match(TokenTypes.GREATER, TokenTypes.GREATER_EQUAL, TokenTypes.LESS, TokenTypes.LESS_EQUAL)){
            let operator:Token = this.previous();
            let right:Expr = this.addition();
            expr = new Binary(expr, operator, right)
        
        }
        return expr;
    }

    equality() {
        let expr:Expr = this.comparison();
        while (this.match(TokenTypes.BANG_EQUAL, TokenTypes.EQUAL_EQUAL)){
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
