import { FerrousCallable } from './FerrousCallable';
import { Interpreter } from './interpreter';

class Clock implements FerrousCallable {

    arity(): number { return 0 };

    call(interpreter: Interpreter, args: Array<Object>): Object {
        return new Date().getTime() / 1000.0;
    }

    toString() {
        return "<native ferrous function>";
    }
}

export { Clock };
