var TokenTypes;
(function (TokenTypes) {
    // Single-character tokens.                      
    TokenTypes[TokenTypes["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    TokenTypes[TokenTypes["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    TokenTypes[TokenTypes["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    TokenTypes[TokenTypes["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    TokenTypes[TokenTypes["COMMA"] = 4] = "COMMA";
    TokenTypes[TokenTypes["DOT"] = 5] = "DOT";
    TokenTypes[TokenTypes["MINUS"] = 6] = "MINUS";
    TokenTypes[TokenTypes["PLUS"] = 7] = "PLUS";
    TokenTypes[TokenTypes["SEMICOLON"] = 8] = "SEMICOLON";
    TokenTypes[TokenTypes["SLASH"] = 9] = "SLASH";
    TokenTypes[TokenTypes["STAR"] = 10] = "STAR";
    // One or two character tokens.                  
    TokenTypes[TokenTypes["BANG"] = 11] = "BANG";
    TokenTypes[TokenTypes["BANG_EQUAL"] = 12] = "BANG_EQUAL";
    TokenTypes[TokenTypes["EQUAL"] = 13] = "EQUAL";
    TokenTypes[TokenTypes["EQUAL_EQUAL"] = 14] = "EQUAL_EQUAL";
    TokenTypes[TokenTypes["GREATER"] = 15] = "GREATER";
    TokenTypes[TokenTypes["GREATER_EQUAL"] = 16] = "GREATER_EQUAL";
    TokenTypes[TokenTypes["LESS"] = 17] = "LESS";
    TokenTypes[TokenTypes["LESS_EQUAL"] = 18] = "LESS_EQUAL";
    // Literals.                                     
    TokenTypes[TokenTypes["IDENTIFIER"] = 19] = "IDENTIFIER";
    TokenTypes[TokenTypes["STRING"] = 20] = "STRING";
    TokenTypes[TokenTypes["NUMBER"] = 21] = "NUMBER";
    // Keywords.                                     
    TokenTypes[TokenTypes["AND"] = 22] = "AND";
    TokenTypes[TokenTypes["CLASS"] = 23] = "CLASS";
    TokenTypes[TokenTypes["ELSE"] = 24] = "ELSE";
    TokenTypes[TokenTypes["FALSE"] = 25] = "FALSE";
    TokenTypes[TokenTypes["FUN"] = 26] = "FUN";
    TokenTypes[TokenTypes["FOR"] = 27] = "FOR";
    TokenTypes[TokenTypes["IF"] = 28] = "IF";
    TokenTypes[TokenTypes["NIL"] = 29] = "NIL";
    TokenTypes[TokenTypes["OR"] = 30] = "OR";
    TokenTypes[TokenTypes["PRINT"] = 31] = "PRINT";
    TokenTypes[TokenTypes["RETURN"] = 32] = "RETURN";
    TokenTypes[TokenTypes["SUPER"] = 33] = "SUPER";
    TokenTypes[TokenTypes["THIS"] = 34] = "THIS";
    TokenTypes[TokenTypes["TRUE"] = 35] = "TRUE";
    TokenTypes[TokenTypes["VAR"] = 36] = "VAR";
    TokenTypes[TokenTypes["WHILE"] = 37] = "WHILE";
    TokenTypes[TokenTypes["EOF"] = 38] = "EOF";
})(TokenTypes || (TokenTypes = {}));
let Keywords = {
    "and": TokenTypes.AND,
    "class": TokenTypes.CLASS,
    "else": TokenTypes.ELSE,
    "false": TokenTypes.FALSE,
    "for": TokenTypes.FOR,
    "fun": TokenTypes.FUN,
    "if": TokenTypes.IF,
    "nil": TokenTypes.NIL,
    "or": TokenTypes.OR,
    "print": TokenTypes.PRINT,
    "return": TokenTypes.RETURN,
    "super": TokenTypes.SUPER,
    "this": TokenTypes.THIS,
    "true": TokenTypes.TRUE,
    "var": TokenTypes.VAR,
    "while": TokenTypes.WHILE
};
class Token {
    constructor(type, lexeme, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.line = line;
    }
}
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.current = 0;
        this.start = 0;
        this.line = 1;
        this.source = source;
    }
    endOfSource() {
        return this.current >= this.source.length;
    }
    advance() {
        this.current = this.current + 1;
        return this.source[this.current - 1];
    }
    addToken(type, value) {
        let token = new Token(type, value, null);
        this.tokens.push(token);
    }
    peek() {
        return this.source[this.current];
    }
    isNumber(c) {
        return (c >= '0' && c <= '9');
    }
    isAlpha(c) {
        return ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_');
    }
    isAlphaNumeric(c) {
        return (this.isNumber(c) || this.isAlpha(c));
    }
    scanToken() {
        let c = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenTypes.LEFT_PAREN);
                break;
            case '(':
                this.addToken(TokenTypes.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenTypes.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenTypes.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenTypes.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenTypes.COMMA);
                break;
            case '.':
                this.addToken(TokenTypes.DOT);
                break;
            case '-':
                this.addToken(TokenTypes.MINUS);
                break;
            case '+':
                this.addToken(TokenTypes.PLUS);
                break;
            case ';':
                this.addToken(TokenTypes.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenTypes.STAR);
                break;
            case '!': {
                if (this.peek() === '=') {
                    this.addToken(TokenTypes.BANG_EQUAL);
                    this.advance();
                }
                else
                    this.addToken(TokenTypes.BANG);
                break;
            }
            case '=': {
                if (this.peek() === '=') {
                    this.addToken(TokenTypes.EQUAL_EQUAL);
                    this.advance();
                }
                else
                    this.addToken(TokenTypes.EQUAL);
                break;
            }
            case '<': {
                if (this.peek() === '=') {
                    this.addToken(TokenTypes.LESS_EQUAL);
                    this.advance();
                }
                else
                    this.addToken(TokenTypes.LESS);
                break;
            }
            case '>': {
                if (this.peek() === '=') {
                    this.addToken(TokenTypes.GREATER_EQUAL);
                    this.advance();
                }
                else
                    this.addToken(TokenTypes.GREATER);
            }
            case '/': {
                if (this.peek() === '/') {
                    //its a comment , consume until exhausted
                    while (this.peek() && this.peek() != "\n")
                        this.advance();
                }
                else
                    this.addToken(TokenTypes.SLASH);
                break;
            }
            case '"': {
                while (this.peek() && this.peek() != '"') {
                    if (this.peek() == '\n')
                        this.line++;
                    this.advance();
                }
                if (this.endOfSource()) {
                    error(this.line, "Unterminated String.");
                    return;
                }
                //consume the last Quote '"'
                this.advance();
                let value = this.source.substring(this.start + 1, this.current - 1);
                this.addToken(TokenTypes.STRING, value);
            }
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.                      
                break;
            case '\n':
                this.line++;
                break;
            default:
                if (this.isNumber(c)) {
                    // 99.0
                    // 99
                    while ((this.peek() && this.isNumber(this.peek()))) {
                        this.advance();
                    }
                    if (this.peek() === ".") {
                        this.advance();
                        while (this.peek() && this.isNumber(this.peek())) {
                            this.advance();
                        }
                    }
                    let value = this.source.substring(this.start, this.current);
                    this.addToken(TokenTypes.NUMBER, value);
                }
                if (this.isAlpha(c)) {
                    //identifiers
                    this.advance();
                    while (this.peek() && this.isAlphaNumeric(this.peek())) {
                        this.advance();
                    }
                    let value = this.source.substring(this.start, this.current);
                    if (Keywords[value])
                        this.addToken(Keywords[value], value);
                    else
                        this.addToken(TokenTypes.IDENTIFIER, value);
                }
                else {
                    error(this.line, "Unexpected character encountered.");
                    break;
                }
        }
    }
    scanTokens() {
        while (!this.endOfSource()) {
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens;
    }
}
function report(line, where, message) {
    console.log(`[ ${line}]: ${message}`);
}
function error(line, message) {
    report;
}
function run() {
    let scanner = new Scanner('<=');
    let tokens = scanner.scanTokens();
    tokens.forEach(token => {
        console.log(token);
    });
}
export default Scanner;
//# sourceMappingURL=lexer.js.map