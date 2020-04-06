import { Parser } from './parser'
import { Scanner } from './lexer';
import { Expr } from './Expr';
// import {ASTPrinter} from './ASTPrinter'

import { Interpreter } from './interpreter';
import { Stmt } from './Stmt';



let source_equality = `print 2 > 4;`



let source_flow_control = `

var a = 10;
var b = 20;



if ( a + b  > 60) {
  print "yes !";
} else {
  print "No !";
}
`

let source_logical_operators = `
print "hi" or 2;
print nil or "yes";
`


let scanner = new Scanner(source_flow_control)

let tokens = scanner.scanTokens()
console.log("Tokens :\n", tokens, "\n\n")
let parser = new Parser(tokens);
let stmts: Array<Stmt> = parser.parse();
console.log("Statements :\n", JSON.stringify(stmts, null, 3), "\n\n");

let interpreter = new Interpreter()
interpreter.interpret(stmts)


