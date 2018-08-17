
import {
    AstNode, Statement, FunCall, Binding, LetBinding,
    Expr, Identifier, Literal, AccessorExpr,
    MethodCall, BinExpr
} from "./ast"


export interface IAstVisitor<R> {
    visit(node: AstNode): R

    visitStatement(node: Statement): R

    visitLetBinding(node: LetBinding): R
    visitBinding(node: Binding): R

    visitExpr(node: Expr): R
    visitIdentifier(node: Identifier): R
    visitLiteral<T>(node: Literal<T>): R
    visitAccessorExpr(node: AccessorExpr): R

    visitMethodCall(node: MethodCall): R
    visitFunCall(node: FunCall): R
    visitBinExpr(node: BinExpr): R
}


export class DefaultVisitor<R> implements IAstVisitor<R> {
    visit(node: AstNode): R {

        let method = `visit${node.tag}`

        return this[method].apply(this, [node]);
    }


    visitStatement(node: Statement): R { return undefined; }

    visitLetBinding(node: LetBinding): R { return undefined; }
    visitBinding(node: Binding): R { return undefined; }

    visitExpr(node: Expr): R { return undefined; }
    visitIdentifier(node: Identifier): R { return undefined; }
    visitLiteral<T>(node: Literal<T>): R { return undefined; }
    visitAccessorExpr(node: AccessorExpr): R { return undefined; }
    visitMethodCall(node: MethodCall): R { return undefined; }
    visitFunCall(node: FunCall): R { return undefined; }
    visitBinExpr(node: BinExpr): R { return undefined; }
}

export class PrintIdVisitor extends DefaultVisitor<void> {

    printer: (node: AstNode) => void

    constructor(printer: (node: AstNode) => void) {
        super();
        this.printer = printer;
    }

    visitIdentifier(node: Identifier): void {
        console.log(node.repr);
    }
}