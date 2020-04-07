### Ferrous 🧪
Ferrous is a `Typescript` port  of [`Lox`](http://www.craftinginterpreters.com/the-lox-language.html), a ***dynamic programming language***.

Once i am comfortable implementing additional features into this language , i will re implement `ferrous` with a byte code compiler, until then this port  will remain a `tree walk interpreter`.

Currently it tries to be a one to one port of `jlox` but I plan on adding additional features making this lox's superset, wherein all valid `lox` programs will be  valid `ferrous` programs.


#### Goal

The goal of this project is to incrementaly build a programming language  **from scratch** and understand the internals of interpreters/compilers ,  **without using any external library for tokenizing / parsing the source**.


- [Building & running ferrous](#build-and-run)       
- [Variables](#variables)       
- [Flow control using if else](#flow-control-using-conditionals)       
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
