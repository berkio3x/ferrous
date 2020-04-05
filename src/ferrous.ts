import { Parser } from './parser'
import { Scanner } from './lexer';
import { Expr } from './Expr';
// import {ASTPrinter} from './ASTPrinter'

import { Interpreter } from './interpreter';
import { Stmt } from './Stmt';


let scanner = new Scanner(`

var a = "global a";
var b = "global b";
var c = "global c";
{
  var a = "outer a";
  var b = "outer b";
  {
    var a = "inner a";
    print a;
    print b;
    print c;
  }
  print a;
  print b;
  print c;
}
print a;
print b;
print c;

`)

let tokens = scanner.scanTokens()
console.log("Tokens :\n", tokens, "\n\n")
let parser = new Parser(tokens);
let stmts: Array<Stmt> = parser.parse();
console.log("Statements :\n", JSON.stringify(stmts, null, 3), "\n\n");

let interpreter = new Interpreter()
interpreter.interpret(stmts)


