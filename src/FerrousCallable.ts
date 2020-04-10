import { Interpreter } from './interpreter';


// interface to deifne callables..ex functions, in ferrous
interface FerrousCallable {
    arity(): number;
    call(interpreter: Interpreter, args: Array<Object>): Object;
};

export { FerrousCallable };