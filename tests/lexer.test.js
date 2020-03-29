import { Scanner } from "../src/lexer.js";


//Write actual tests here
test('Test LEXER token [ () ]', () => {
    let scanner = new Scanner('(');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'type': 0 });

});

test('Test LEXER ignores comments', () => {

    let scanner = new Scanner('( // this is a comment');
    let tokens = scanner.scanTokens();
    expect(scanner.scanTokens()).toHaveLength(1);

});


test('Test LEXER String literal', () => {
    let scanner = new Scanner('"Hello world"');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({
        'lexeme': "\"Hello world\"",
        'literal': "Hello world",
        type: 20
    });

});

test('Test LEXER Number', () => {
    let scanner = new Scanner('99');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'lexeme': "99" });

});

test('Test LEXER Number with Decimal', () => {
    let scanner = new Scanner('99.88');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'lexeme': "99.88" });

});

test('Test LEXER Identifier', () => {
    let scanner = new Scanner('userName');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'lexeme': "userName", 'type': 19 });


});

test('Test LEXER Identifier starts with underscore', () => {
    let scanner = new Scanner('_userName');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'lexeme': "_userName", 'type': 19 });


});

test('Test LEXER Identifier contains number', () => {
    let scanner = new Scanner('userName22');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'lexeme': "userName22", 'type': 19 });


});

test('Test LEXER reserved keywords', () => {
    let scanner = new Scanner('and');
    let tokens = scanner.scanTokens();
    expect(tokens[0]).toMatchObject({ 'lexeme': "and", 'type': 22 });


});