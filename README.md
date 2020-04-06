### Ferrous 🧪
Ferrous is a ***dynamic programming language***, much like python/javascript, written in `Typescript`.    

##### Features implemented

   - [Goal](#goal)       
   - [Variables](#variables)       
   - [Flow control using if else](#flow-control-using-conditionals)       
   - [Scopes](#scopes)         


#### Goal

The goal of this project is to incrementaly build a programming language  **from scratch** and understand the internals of interpreters/compilers ,  **without using any external library for tokenizing / parsing the source**.

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
