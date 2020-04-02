import {Token} from './lexer';


class Environment {

    values:Map<any, Object>;

    constructor(){
        this.values = new Map();
    }
    
    define(name:any, value:Object){
        this.values.set(name, value);

    }

    get(name:any):Object{
        console.log(":))))")
        if(this.values.has(name.lexeme)){
            return this.values.get(name.lexeme)
        }

        throw new Error('value not defined.')

    }
    
}

export {Environment}