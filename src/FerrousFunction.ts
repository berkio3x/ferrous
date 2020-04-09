import { FerrousCallable } from './FerrousCallable';
import { Funct } from './Stmt';
import { Interpreter } from './interpreter';
import { Environment } from './Environment';


class FerrousFunction implements FerrousCallable {

    declaration: Funct;

    constructor(declaration: Funct) {
        this.declaration = declaration;
    }

    call(interpreter: Interpreter, args: Array<Object>): Object {
        let env: Environment = new Environment(interpreter.globals);
        for (var i = 0; i < this.declaration.params.length; i++) {
            env.define(this.declaration.params[i].lexeme, args[i]);
        }
        interpreter.executeBlock(this.declaration.body, env);
        return null;
    }

    toString() {
        return "<function " + this.declaration.name.lexeme + " >";
    }


}

export { FerrousFunction };