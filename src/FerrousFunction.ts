import { FerrousCallable } from './FerrousCallable';
import { Funct } from './Stmt';
import { Interpreter } from './interpreter';
import { Environment } from './Environment';
import { RetrunException } from './ReturnException';


class FerrousFunction implements FerrousCallable {

    declaration: Funct;

    constructor(declaration: Funct) {
        this.declaration = declaration;
    }

    arity(): number { return this.declaration.params.length; }

    call(interpreter: Interpreter, args: Array<Object>): Object {

        let env: Environment = new Environment(interpreter.globals);
        for (var i = 0; i < this.declaration.params.length; i++) {
            env.define(this.declaration.params[i].lexeme, args[i]);
        }

        // catch the returnException here to unwind the stack in case of return statements;
        try {
            interpreter.executeBlock(this.declaration.body, env);
        } catch (value) {
            if (value instanceof RetrunException)
                return value.value;
        }

        // if there is no return value , return  null value by default
        return null;
    }

    toString() {
        return "<function " + this.declaration.name.lexeme + " >";
    }


}

export { FerrousFunction };