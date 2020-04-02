import {Parser} from './parser'
import {Scanner} from './lexer';
import {Expr} from './Expr';
// import {ASTPrinter} from './ASTPrinter'

import {Interpreter} from './interpreter';
import { Stmt } from './Stmt';


let scanner = new Scanner(`
  var a = 10;
  var b = 90;

  print a + b;

`)

let tokens = scanner.scanTokens()
console.log("Tokens :\n",tokens,"\n\n")
let parser = new Parser(tokens);
let stmts:Array<Stmt> = parser.parse();
console.log("Statements :\n",stmts,"\n\n");

let interpreter = new Interpreter()
interpreter.interpret(stmts)


