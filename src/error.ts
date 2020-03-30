import { Token, TokenTypes } from "./lexer";


function report(line: number, where: string, message: string){
    console.log(`[ ${line}]: ${message}`);
}

function error(token:Token, message:string){
    if(token.type == TokenTypes.EOF){
        report(token.line, "at end", message);
    }
    else{
        report(token.line, `at ' ${token.lexeme} '`, message)
    }
    }
    
export{
    error
}
