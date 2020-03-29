import { Parser } from '../src/parser'
import { Scanner } from '../src/lexer';
import { Literal, Binary, Grouping, Unary } from '../src/Expr';
import { Token } from '../src/lexer.js'
import { TokenTypes } from '../src/lexer.js';


test('[Parser]: Test precedence of division with minus', () => {
    let scanner = new Scanner('6/3-2')
    let tokens = scanner.scanTokens()
    let parser = new Parser(tokens);
    let expression = parser.parse();

    let expr = new Binary(
        new Binary(new Literal(6), new Token(TokenTypes.SLASH, "/", null, 1), new Literal(3)),
        new Token(TokenTypes.MINUS, "-", null, 1),
        new Literal(2)
    )

    expect(expr).toStrictEqual(expression)
})