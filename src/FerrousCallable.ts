import { Interpreter } from './interpreter';


// interface to deifne callables..ex functions, in ferrous
interface FerrousCallable {
    call(interpreter: Interpreter, args: Array<Object>): Object;
};

export { FerrousCallable };