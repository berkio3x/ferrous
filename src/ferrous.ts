import { Parser } from './parser'
import { Scanner } from './lexer';
import { Expr } from './Expr';
// import {ASTPrinter} from './ASTPrinter'

import { Interpreter } from './interpreter';
import { Stmt } from './Stmt';
import * as fs from 'fs';

let source_file_path: string = process.argv[2]

let source: Buffer;

try {
  source = fs.readFileSync(source_file_path);
  let scanner = new Scanner(source.toString());

  let tokens = scanner.scanTokens()
  // console.log("Tokens :\n", tokens, "\n\n")
  let parser = new Parser(tokens);
  let stmts: Array<Stmt> = parser.parse();
  // console.log("Statements :\n", JSON.stringify(stmts, null, 3), "\n\n");
  let interpreter = new Interpreter()
  interpreter.interpret(stmts)
} catch (error) {
  console.log(error, "Error opening the given source file")
}




