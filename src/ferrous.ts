import {Parser} from './parser'
import {Scanner} from './lexer';
import {Expr} from './Expr';
import {ASTPrinter} from './ASTPrinter'
import {Interpreter} from './interpreter';
import { Stmt } from './Stmt';


let scanner = new Scanner(`
    print 2+1;
    print true;
    print false;
    print 30+3*2;

`)


let tokens = scanner.scanTokens()
let parser = new Parser(tokens);
let stmts:Array<Stmt> = parser.parse();

let interpreter = new Interpreter()
interpreter.interpret(stmts)


// console.log(new ASTPrinter().print(expression))

// let expr:Expr = new Binary(
//     new Unary(
//         new Token(TokenTypes.MINUS, "-", null, 1),
//         new Literal(123)
//     ),
//     new Token(TokenTypes.STAR,"*",null,1),
//     new Grouping(
//         new Literal(45.67)
//     ));

