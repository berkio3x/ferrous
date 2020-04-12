### Ferrous 🧪
Ferrous is a [Typescript](https://www.typescriptlang.org/) port  of [Lox](http://www.craftinginterpreters.com/the-lox-language.html), a ***dynamic programming language***.

Once I am done with adding  features into this language , I will re implement `ferrous` with a byte code compiler, until then this port  will remain a `tree walk interpreter`.

Currently it tries to be a one to one port of `jlox` but I plan on adding additional features making this lox's superset, wherein all valid `lox` programs will be  valid `ferrous` programs.


### Intoduction to ferrous

- [Building & running ferrous](#build-and-run)       
- [Variables](#variables)
- Flow Control
  * [Conditionals using if else](#flow-control-using-conditionals)  
  * [while loop](#while)
  * [for loop](#for)
- Functions
  * [syntax](#function)
  * [return values](#function-return-values)
  * [Implicit return value](#function-implicit-return-value)
  * [Closures](#closures)
- [Scopes](#scopes)     





#### Build and run
```sh
yarn install && yarn build.   
chmod a+x ./ferrous
./ferrous
```


#### Variables.         

You can bind a value to a variable using `=` operator.ex.
```C
var color = '#FF0000';
```
#### Flow control using conditionals.
```C

var a = 10;
var b = 20;
if ( a+b  > 60) {
  print "yes !";
} else {
  print "No !";
}
```

#### While
1. while with block of statements
```C
var a = 0;
while (a < 10){
    print a;
    a = a + 1;
}
// prints from 0...9

```
2. while with single expression body

```C
var c = 0;
while (c < 3) print c = c + 1;
// prints 1...3
```

#### For
1. Using single expression body.
```C
for (var i = 0; i < 10; i = i + 1) print i;
// 0..9
```

2. Using block statements
```C
for (var i = 0; i < 10; i = i + 1){
  print i;
}
```

#### Function

1. ##### Function syntax
```C
fun sayHi(msg){
    print msg;
}
sayHi("hello world");
```

2. ##### Function return values
```C

fun sayHi() { return "Hi"; }
var msg = demo();
print msg; // Hi
```

3. ##### Function implicit return value.
If a return statement is missing in the function declaration `null` is returned by default.
```C

fun calculate() {
    print 10+20;
    // No return statement here
}
var value = demo();
print value; // null
```

4. ##### Closures.
```C
fun makeCounter() {
  var i = 0;
  fun count() {
    i = i + 1;
    print i;
  }
  return count;
}

var counter = makeCounter();
counter(); // "1".
counter(); // "2".
```

#### Scopes
```C
var a = "global a";
var b = "global b";
var c = "global c";
{
  var a = "outer a";
  var b = "outer b";
  {
    var a = "inner a";
    print a;
    print b;
    print c;
  }
  print a;
  print b;
  print c;
}
print a;
print b;
print c;

/*
inner a
outer b
global c
outer a
outer b
global c
global a
global b
global c
*/

```
