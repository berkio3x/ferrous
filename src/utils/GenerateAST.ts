/*
The idea is to represent the syntax tree in terms of expressions


For given input in this form:

let Expressions:Array<string> = [
    "Binary   => left:Expr , operator:TokenTypes, right:Expr",
    "Grouping => expression:Expr",
    "Literal  => Value:Object",
    "Unary    => operator:TokenTypes, right: Expr"
]

Generate code of below form to handle expressions.


abstract class Expr{
    accept(vv: Ivisitor): any ;
}


class Binary extends Expr {
    
    left : Expr;
    operator: TokenTypes;
    right: Expr;

    constructor(left: Expr, right: Expr, operator: TokenTypes){
        super()
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    accept(vv: IVisitor){
        vv.VisitBinaryExpression()

    }
}

...

interface IVisitor {
    VisitBinaryExpr();
    VisitUnaryExpr();
    ....


}

class prettyPrinter implements Visitor{

    VisitBinaryExpr(){
        console.log('printing pretty Binary Expressions')

    }

    VisitUnaryExpr(){
        console.log('printing pretty Unary Expressions')

    }

    ...... Rest of the methods defined in the interface
}


*/

var fs = require("fs");

function defineIntro(fd: any) {
  fs.appendFileSync(
    fd,
    `
        \n
/* 
This is an auto generated file by using utils/exprGen.ts utility cli program of Ferrous.
(っ◔◡◔)っ ♥ ast ♥
*/
        \n\n
`
  );
}

function defineExports(fd: any, baseClassName: string, types: Array<string>) {
  fs.appendFileSync(fd, "export {\n");
  types.forEach((type) => {
    let classNameToExport = type.split("=>")[0].replace(" ", "");
    fs.appendFileSync(fd, `  ${classNameToExport},\n`);
  });
  fs.appendFileSync(fd, `  ${baseClassName}Visitor,\n`);
  fs.appendFileSync(fd, `  ${baseClassName}\n`);
  fs.appendFileSync(fd, `}`);
}

function defineVisitor(fd: any, className: string, types: Array<string>) {
  fs.appendFileSync(fd, `interface ${className}Visitor {\n\n`);
  types.forEach((type) => {
    var typeName = type.split("=>")[0].replace(" ", "");
    fs.appendFileSync(
      fd,
      `    visit${typeName}${className} (vs: ${typeName} ):any ;\n`
    );
  });
  fs.appendFileSync(fd, "}\n\n");
}


function defineType(
  fd: any,
  className: string,
  baseClassName: string,
  attributes: Array<string>
) {
  fs.appendFileSync(fd, `class ${className} implements ${baseClassName} {\n`, "utf8");
  fs.appendFileSync(fd, "\n");

  attributes.forEach((attr) => {
    var attrName = attr.split(":")[0];
    var type = attr.split(":")[1];

    fs.appendFileSync(fd, `    ${attrName}: ${type};`, "utf8");
    fs.appendFileSync(fd, "\n");
  });

  fs.appendFileSync(fd, "\n");

  //generate the constructor for classes
  fs.appendFileSync(fd, `    constructor(${attributes}){\n\n`, "utf8");

  attributes.forEach((attr) => {
    var attrName = attr.split(":")[0].replace(" ", "");
    var type = attr.split(":")[1];
    fs.appendFileSync(fd, `\t\tthis.${attrName} = ${attrName};\n`);
  });

  fs.appendFileSync(fd, `\n    }\n\n`);

  //define accept method of the concrete class implementations
  fs.appendFileSync(fd, `    accept(vv: ${baseClassName}Visitor) {\n`);
  fs.appendFileSync(
    fd,
    `        return vv.visit${className}${baseClassName}(this);\n`
  );
  fs.appendFileSync(fd, `    }\n`);
  fs.appendFileSync(fd, `\n}\n\n`);
}


function defineImports(fd: any, deps: Array<string>) {

  deps.forEach((dep) => {
    console.log(dep)
    let depName: string = dep.split(':')[0];
    let depPath: string = dep.split(':')[1];
    fs.appendFileSync(fd, `import {${depName}} from '${depPath}'\n`)
  })
}

function GenerateAst(outputDir: string, baseClassName: string, ast: Array<string>, deps?: Array<string>) {
  let fileName = `${outputDir}/${baseClassName}.ts`;
  let error = null;

  try {
    var fd = fs.openSync(fileName, "a");
    defineIntro(fd);
    fs.appendFileSync(fd, `import {Token} from './lexer';\n\n`);
    defineImports(fd, deps);
    fs.appendFileSync(fd, `interface ${baseClassName}{\n\n`, "utf8");
    fs.appendFileSync(fd, `    accept(vv: ${baseClassName}Visitor): any;\n`);
    fs.appendFileSync(fd, "}\n");
  } catch (err) {
    error = error;
    console.error("Error while writing to file");
  }

  if (!error) {
    defineVisitor(fd, baseClassName, ast);

    // generate rest of the classes
    ast.forEach((item) => {
      var className = item.split("=>")[0];
      var attrs = item.split("=>")[1].split(",");

      defineType(fd, className, baseClassName, attrs);
    });
    defineExports(fd, baseClassName, ast);
  } else {
    fs.closeSync(fd);
  }
}

if (process.argv.length === 2) {
  console.error("Expected at least one argument [path to output]");
  process.exit(1);
}

let outputDir: string = process.argv[2];
console.log(outputDir);

let Expressions: Array<string> = [
  "Assign=>name:Token, value:Expr",
  "Binary=>left:Expr , operator:Token, right:Expr",
  "Grouping=>expression:Expr",
  "Literal=>Value:Object",
  "Unary=>operator:Token, right: Expr",
  "Variable=>name:Token"
];


let Statements: Array<string> = [
  "Expression=>expression:Expr",
  "Print=>expression:Expr",
  "Var=>name:Token, initializer:Expr",
  "Block=>statements:Array<Stmt>"
]

GenerateAst(outputDir, "Expr", Expressions, []);
GenerateAst(outputDir, "Stmt", Statements, ["Expr:./Expr"])
