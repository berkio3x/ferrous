import Scanner from "../src/lexer.js";


//Write actual tests here
test('Test lexer token [ () ]', () => {
    let scanner = new Scanner('(');
    let tokens = scanner.scanTokens();
    expect(scanner.scanTokens()[0]).toMatchObject({ 'type': 0 });

});