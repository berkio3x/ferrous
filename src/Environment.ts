import { Token } from './lexer';





/*


{
    var a = 10;
    {
        var a = 20;
        var b = 30;
    }
}

*/

class Environment {

    enclosing: Environment;

    values: Map<any, Object>;

    constructor(enclosing?: Environment) {
        if (enclosing != undefined) {
            this.enclosing = enclosing;
        }
        else {
            this.enclosing = null;
        }
        this.values = new Map();
    }

    define(name: any, value: Object) {
        this.values.set(name, value);

    }

    get(name: any): Object {

        if (this.values.has(name.lexeme)) {

            return this.values.get(name.lexeme)
        }
        if (this.enclosing != undefined) return this.enclosing.get(name)

        throw new Error('value not defined.')
    }


    assign(name: any, value: Object) {
        if (this.values.has(name)) {
            this.values.set(name, value)
            return;
        }

        if (this.enclosing != undefined) {
            this.enclosing.assign(name, value);
            return;
        }
        throw new Error(`${name} Undefined variable ${name}`);
    }

}

export { Environment }