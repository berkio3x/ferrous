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
function defineIntro(fd) {
    fs.appendFileSync(fd, "\n        \n\n/* \nThis is an auto generated file by using utils/exprGen.ts utility cli program of Ferrous.\n(\u3063\u25D4\u25E1\u25D4)\u3063 \u2665 ast \u2665\n*/\n        \n\n\n");
}
function defineExports(fd, baseClassName, types) {
    fs.appendFileSync(fd, "export {\n");
    types.forEach(function (type) {
        var classNameToExport = type.split("=>")[0].replace(" ", "");
        fs.appendFileSync(fd, "  " + classNameToExport + ",\n");
    });
    fs.appendFileSync(fd, "  " + baseClassName + "Visitor,\n");
    fs.appendFileSync(fd, "  " + baseClassName + "\n");
    fs.appendFileSync(fd, "}");
}
function defineVisitor(fd, className, types) {
    fs.appendFileSync(fd, "interface " + className + "Visitor {\n\n");
    types.forEach(function (type) {
        var typeName = type.split("=>")[0].replace(" ", "");
        fs.appendFileSync(fd, "    visit" + typeName + className + " (vs: " + typeName + " ):any ;\n");
    });
    fs.appendFileSync(fd, "}\n\n");
}
function defineType(fd, className, baseClassName, attributes) {
    fs.appendFileSync(fd, "class " + className + " implements " + baseClassName + " {\n", "utf8");
    fs.appendFileSync(fd, "\n");
    attributes.forEach(function (attr) {
        var attrName = attr.split(":")[0];
        var type = attr.split(":")[1];
        fs.appendFileSync(fd, "    " + attrName + ": " + type + ";", "utf8");
        fs.appendFileSync(fd, "\n");
    });
    fs.appendFileSync(fd, "\n");
    //generate the constructor for classes
    fs.appendFileSync(fd, "    constructor(" + attributes + "){\n\n", "utf8");
    attributes.forEach(function (attr) {
        var attrName = attr.split(":")[0].replace(" ", "");
        var type = attr.split(":")[1];
        fs.appendFileSync(fd, "\t\tthis." + attrName + " = " + attrName + ";\n");
    });
    fs.appendFileSync(fd, "\n    }\n\n");
    //define accept method of the concrete class implementations
    fs.appendFileSync(fd, "    accept(vv: " + baseClassName + "Visitor) {\n");
    fs.appendFileSync(fd, "        return vv.visit" + className + baseClassName + "(this);\n");
    fs.appendFileSync(fd, "    }\n");
    fs.appendFileSync(fd, "\n}\n\n");
}
function defineImports(fd, deps) {
    deps.forEach(function (dep) {
        console.log(dep);
        var depName = dep.split(':')[0];
        var depPath = dep.split(':')[1];
        fs.appendFileSync(fd, "import {" + depName + "} from '" + depPath + "'\n");
    });
}
function GenerateAst(outputDir, baseClassName, ast, deps) {
    var fileName = outputDir + "/" + baseClassName + ".ts";
    var error = null;
    try {
        var fd = fs.openSync(fileName, "a");
        defineIntro(fd);
        fs.appendFileSync(fd, "import {Token} from './lexer';\n\n");
        defineImports(fd, deps);
        fs.appendFileSync(fd, "interface " + baseClassName + "{\n\n", "utf8");
        fs.appendFileSync(fd, "    accept(vv: " + baseClassName + "Visitor): any;\n");
        fs.appendFileSync(fd, "}\n");
    }
    catch (err) {
        error = error;
        console.error("Error while writing to file");
    }
    if (!error) {
        defineVisitor(fd, baseClassName, ast);
        // generate rest of the classes
        ast.forEach(function (item) {
            var className = item.split("=>")[0];
            var attrs = item.split("=>")[1].split(",");
            defineType(fd, className, baseClassName, attrs);
        });
        defineExports(fd, baseClassName, ast);
    }
    else {
        fs.closeSync(fd);
    }
}
if (process.argv.length === 2) {
    console.error("Expected at least one argument [path to output]");
    process.exit(1);
}
var outputDir = process.argv[2];
console.log(outputDir);
var Expressions = [
    "Assign=>name:Token, value:Expr",
    "Binary=>left:Expr , operator:Token, right:Expr",
    "Grouping=>expression:Expr",
    "Literal=>Value:Object",
    "Unary=>operator:Token, right: Expr",
    "Variable=>name:Token",
    "Logical=>left:Expr, operator:Token, right:Expr",
    "Call=>callee:Expr, paren:Token, args:Array<Expr>",
];
var Statements = [
    "Expression=>expression:Expr",
    "Funct=>name:Token, params:Array<Token>, body:Array<Stmt>",
    "Print=>expression:Expr",
    "Var=>name:Token, initializer:Expr",
    "Block=>statements:Array<Stmt>",
    "If=>condition:Expr, thenBranch:Stmt, elseBranch:Stmt",
    "While=>condition:Expr, body:Stmt",
    "Return=>value:Expr, keyword:Token",
];
GenerateAst(outputDir, "Expr", Expressions, []);
GenerateAst(outputDir, "Stmt", Statements, ["Expr:./Expr"]);
