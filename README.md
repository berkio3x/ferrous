# Ferrous 🧪
Ferrous is a dynamically typed interpreted programming language.  

**The compiler is written in Typescript**


#### Goal
The goal of this project is to incrementaly build a programming language from start to end.


1. Scopes
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
