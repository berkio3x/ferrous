# Ferrous 🧪
Ferrous is a ***dynamic programming language***, much like python/javascript.  

**The compiler is written in Typescript**


## Goal

The goal of this project is to incrementaly build a programming language  **from scratch** and understand the internals of interpreters/compilers ,  **without using any external library for tokenizing / parsing the source**.

##### 1) Variables.         

You can bind a value to a variable using `=` operator.ex.
```C
var color = '#FF0000';
```

##### 2)  Scopes
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
