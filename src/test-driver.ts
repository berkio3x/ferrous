import {Parser} from './parser'
import {Scanner} from './lexer';
import {Expr} from './Expr';
import {ASTPrinter} from './ASTPrinter'

// let scanner = new Scanner('6/3-2')
// let tokens = scanner.scanTokens()
// let parser = new Parser(tokens);
// let expression:Expr = parser.parse();


let scanner = new Scanner('6/3-2')
let tokens = scanner.scanTokens()
let parser = new Parser(tokens);
let expression = parser.parse();

console.log('Started parsing :)')
console.log(expression)

console.log(new ASTPrinter().print(expression))

// let expr:Expr = new Binary(
//     new Unary(
//         new Token(TokenTypes.MINUS, "-", null, 1),
//         new Literal(123)
//     ),
//     new Token(TokenTypes.STAR,"*",null,1),
//     new Grouping(
//         new Literal(45.67)
//     ));

