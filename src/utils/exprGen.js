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
var fs = require('fs');
var Expressions = [
    "Binary=> left:Expr , operator:TokenTypes, right:Expr",
    "Grouping=> expression:Expr",
    "Literal=> Value:Object",
    "Unary=> operator:TokenTypes, right: Expr"
];
function defineInto(fd) {
    fs.appendFileSync(fd, "\n\n/* This is an auto generated file by using utils/exprGen.ts utility cli program */\n\n\n");
}
function defineVisitor(fd, className, types) {
    fs.appendFileSync(fd, "interface Visitor {\n\n");
    types.forEach(function (type) {
        var typeName = type.split('=>')[0].replace(" ", '');
        fs.appendFileSync(fd, "    visit" + typeName + className + " (vs: " + typeName + " ):any ;\n");
    });
    fs.appendFileSync(fd, '}\n\n');
}
function defineType(fd, className, attributes) {
    console.log(fd);
    fs.appendFileSync(fd, "class " + className + " Extends Expr {\n", 'utf8');
    fs.appendFileSync(fd, '\n');
    attributes.forEach(function (attr) {
        var attrName = attr.split(':')[0];
        var type = attr.split(':')[1];
        fs.appendFileSync(fd, "    " + attrName + ": " + type, 'utf8');
        fs.appendFileSync(fd, '\n');
    });
    fs.appendFileSync(fd, '\n');
    //generate the constructor for classes
    fs.appendFileSync(fd, "    constructor(" + attributes + "){\n\n", 'utf8');
    attributes.forEach(function (attr) {
        var attrName = attr.split(':')[0].replace(' ', '');
        var type = attr.split(':')[1];
        fs.appendFileSync(fd, "\t\tthis." + attrName + " = " + attrName + "\n");
    });
    fs.appendFileSync(fd, "\n    }\n");
    fs.appendFileSync(fd, "\n}\n\n");
}
function GenerateAst(outputDir, baseClassName) {
    var fileName = outputDir + "/expr.ts";
    var error = null;
    try {
        var fd = fs.openSync(fileName, 'a');
        defineInto(fd);
        fs.appendFileSync(fd, "abstract class " + baseClassName + "{}", 'utf8');
        fs.appendFileSync(fd, '\n');
    }
    catch (err) {
        error = error;
        console.error('Error while writing to file');
    }
    if (!error) {
        defineVisitor(fd, baseClassName, Expressions);
        // generate rest of the classes
        Expressions.forEach(function (item) {
            var className = item.split('=>')[0];
            var attrs = item.split('=>')[1].split(',');
            defineType(fd, className, attrs);
        });
    }
    else {
        fs.closeSync(fd);
    }
}
if (process.argv.length === 2) {
    console.error('Expected at least one argument [path to output]');
    process.exit(1);
}
var outputDir = process.argv[2];
console.log(outputDir);
GenerateAst(outputDir, "Expr");
