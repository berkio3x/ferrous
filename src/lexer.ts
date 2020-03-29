enum TokenTypes {                                   
    // Single-character tokens.                      
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
    COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR, 
    
    // One or two character tokens.                  
    BANG, BANG_EQUAL,                                
    EQUAL, EQUAL_EQUAL,                              
    GREATER, GREATER_EQUAL,                          
    LESS, LESS_EQUAL,                                
    
    // Literals.                                     
    IDENTIFIER, STRING, NUMBER,
    
    // Keywords.                                     
    AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,  
    PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,    
    
    EOF                                        
}

let Keywords = {
    "and":  TokenTypes.AND,                       
    "class":  TokenTypes.CLASS,                   
    "else":   TokenTypes.ELSE,                      
    "false":  TokenTypes.FALSE,                     
    "for":    TokenTypes.FOR,                      
    "fun": TokenTypes.FUN,                     
    "if":  TokenTypes.IF,                        
    "nil":  TokenTypes.NIL,                       
    "or":  TokenTypes. OR,                        
    "print":  TokenTypes.PRINT,                     
    "return":  TokenTypes.RETURN,                    
    "super":  TokenTypes.SUPER,                     
    "this":  TokenTypes.THIS,                     
    "true":  TokenTypes.TRUE,                      
    "var":  TokenTypes.VAR,                      
    "while":  TokenTypes.WHILE                     
}

class Token{
    
    type: TokenTypes;
    lexeme: string;
    line: number;
    literal: Object;

    constructor(type: TokenTypes, lexeme: string, literal:Object, line: number){
        this.type = type;
        this.lexeme = lexeme;
        this.line = line;
        this.literal = literal;
    }
}

class Scanner {
    
    source: string;
    tokens: Array<Token> = [];
    current: number = 0;
    start: number = 0;
    line : number = 1;

    constructor(source: string){
        this.source = source;
    }

    endOfSource() : boolean {
        return this.current >= this.source.length;
    }

    advance(): string { 
        this.current =  this.current + 1;
        return this.source[this.current- 1];
   
    }

    addToken(type:TokenTypes, literal?:Object){
        
        let text :string = this.source.substring(this.start, this.current)
        if (literal){
            this.tokens.push(new Token(type, text, literal, this.line))
        }
        else{
            this.tokens.push(new Token(type, text, null, this.line))
        }
    }

    peek(): string  {
        return this.source[this.current]; 
    }

    isNumber(c): boolean {
        return (c >= '0' && c <= '9')

    }

    isAlpha(c): boolean {
        return ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_')
    }

    isAlphaNumeric(c): boolean {
        return (this.isNumber(c) || this.isAlpha(c))
    }
    scanToken(){
        let c: string = this.advance();
        switch(c){
            case '(': this.addToken(TokenTypes.LEFT_PAREN); break;     
            case '(': this.addToken(TokenTypes.LEFT_PAREN); break;     
            case ')': this.addToken(TokenTypes.RIGHT_PAREN); break;    
            case '{': this.addToken(TokenTypes.LEFT_BRACE); break;     
            case '}': this.addToken(TokenTypes.RIGHT_BRACE); break;    
            case ',': this.addToken(TokenTypes.COMMA); break;          
            case '.': this.addToken(TokenTypes.DOT); break;            
            case '-': this.addToken(TokenTypes.MINUS); break;          
            case '+': this.addToken(TokenTypes.PLUS); break;           
            case ';': this.addToken(TokenTypes.SEMICOLON); break;      
            case '*': this.addToken(TokenTypes.STAR); break; 
            case '!': {
                if (this.peek() === '='){
                    this.addToken(TokenTypes.BANG_EQUAL);
                    this.advance();
                }
                else
                    this.addToken(TokenTypes.BANG);
                break;
            }
            case '=' : {
                if (this.peek() === '='){
                    this.addToken(TokenTypes.EQUAL_EQUAL);
                    this.advance()
                }
                else
                    this.addToken(TokenTypes.EQUAL);
                break;

            }
            case '<': {
                if (this.peek() === '='){
                    this.addToken(TokenTypes.LESS_EQUAL);
                    this.advance()
                }
                else
                    this.addToken(TokenTypes.LESS)
                break;
            }
            case '>': {
                if (this.peek() === '='){
                    this.addToken(TokenTypes.GREATER_EQUAL)
                    this.advance();
                }
                else
                    this.addToken(TokenTypes.GREATER)
            }

            case '/': {
                if (this.peek() === '/'){
                    //its a comment , consume until exhausted
                    while(this.peek() && this.peek() != "\n") this.advance()
                }
                else
                    this.addToken(TokenTypes.SLASH);
                break;
            }
            case '"':{
                
                while(this.peek() && this.peek()!='"'){
                    if(this.peek()=='\n') this.line++;
                    this.advance();
                }
                if(this.endOfSource()){
                    error(this.line, "Unterminated String.");
                    return
                }

                //consume the last Quote '"'
                this.advance()
                let value: string = this.source.substring(this.start+1, this.current-1); 
                this.addToken(TokenTypes.STRING, value)
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

                if (this.isNumber(c)){
                    // 99.0
                    // 99

                    while((this.peek() && this.isNumber(this.peek()))) {
                        this.advance()

                    }
                    if (this.peek() === "."){
                        this.advance()
                        while(this.peek() && this.isNumber(this.peek())){
                            this.advance()
                        }
                    }
                    let value: string = this.source.substring(this.start , this.current)

                    this.addToken(TokenTypes.NUMBER, Number(value))

                }
                if (this.isAlpha(c)){
                    //identifiers

                    this.advance()

                    while(this.peek() && this.isAlphaNumeric(this.peek())){
                        this.advance()
                    }
                    let value: string = this.source.substring(this.start, this.current)
                    if (Keywords[value]) 
                        this.addToken(Keywords[value], value)
                    
                    else 
                        this.addToken(TokenTypes.IDENTIFIER, value)
                    
                    }
                else
                {
                error(this.line, "Unexpected character encountered.");
                break;
                }
       
        }
    }

    scanTokens(): Array<Token> {
        while(!this.endOfSource()){
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens
    
    }
}

function report(line: number, where: string, message: string){
    console.log(`[ ${line}]: ${message}`);

}

function error(line: number , message: string ){
    report
}

function run(){

    let  scanner  = new Scanner('<=');

    let tokens: Array<Token> = scanner.scanTokens();
    
    tokens.forEach(token => {
        console.log(token);   
    });

}

export  {Scanner, Token, TokenTypes};