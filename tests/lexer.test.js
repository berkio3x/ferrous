import Scanner from "../src/lexer.js";


//Write actual tests here
test('Test LEXER token [ () ]', () => {
    let scanner = new Scanner('(');
    let tokens = scanner.scanTokens();
    expect(scanner.scanTokens()[0]).toMatchObject({ 'type': 0 });

});

test('Test LEXER ignores comments', () => {

    let scanner = new Scanner('( // this is a comment');
    let tokens = scanner.scanTokens();
    expect(scanner.scanTokens()).toHaveLength(1);



});

test('Test LEXER String literal', () => {

    let scanner = new Scanner('"Hello world"');
    let tokens = scanner.scanTokens();
    expect(scanner.scanTokens()[0]).toMatchObject({ 'lexeme': "Hello world", type: 21 });



});