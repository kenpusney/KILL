import { IAstVisitor } from "./visitor";

export type Tag = string

export interface AstNode {
    tag: Tag
}

export class Statement implements AstNode {
    tag: Tag = "Statement"
    statement: Decl | Expr
    comment: string

    constructor(statement: Decl | Expr, comment: string) {
        this.statement = statement;
        this.comment = comment;
    }
}

export interface Decl extends AstNode {
}

export interface Expr extends AstNode {
}

export class LetBinding implements Expr {
    tag: Tag = "LetBinding"
    bindings: Binding[]

    constructor(bindings: Binding[]) {
        this.bindings = bindings;
    }
}

export class Binding implements Expr {
    tag: Tag = "Binding"
    variable: Identifier
    expr: Expr

    constructor(variable: Identifier, expr: Expr) {
        this.variable = variable;
        this.expr = expr;
    }
}

export class Identifier implements Expr {
    tag: Tag = "Identifier"
    repr: string

    constructor(repr: string) {
        this.repr = repr;
    }
}

export type LiteralTypes = string

export class Literal<T> implements Expr{
    tag: Tag = "Literal"
    type: LiteralTypes
    value: T

    constructor(type: LiteralTypes, value: T) {
        this.type = type;
        this.value = value;
    }
}

export type NumberNode = Literal<number>

export type StringNode = Literal<string>

export class AccessorExpr implements Expr {
    tag: Tag = "AccessorExpr"
    primary: Expr
    accessors: Accessor[]

    constructor(primary: Expr, accessors: Accessor[]) {
        this.primary = primary;
        this.accessors = accessors
    }
}

export type Accessor = Identifier | MethodCall | Literal<any>

export class MethodCall implements AstNode {
    tag: Tag = "MethodCall"
    name: Identifier
    args: Expr[]

    constructor(name: Identifier, args: Expr[]) {
        this.name = name;
        this.args = args;
    }
}

export class FunCall implements Expr {
    tag: Tag = "FunCall"
    fun: Expr
    args: Expr[]

    constructor(fun: Expr, args: Expr[]) {
        this.fun = fun;
        this.args = args;
    }
}

export class BinExpr implements Expr {
    tag: string = "BinExpr"
    repr: string
    left: Expr
    right: Expr

    constructor(repr: string, left: Expr, right: Expr) {
        this.repr = repr;
        this.left = left;
        this.right = right;
    }
}

export function stmt(statement: Decl | Expr, comment = null): Statement {
    return new Statement(statement, comment);
}

export function letb(...bindings: Binding[]): LetBinding {
    return new LetBinding(bindings);
}

export function binding(variable: Identifier, expr: Expr): Binding {
    return new Binding(variable, expr);
}

export function ident(repr: string): Identifier {
    return new Identifier(repr);
}

export function literal<T>(type: LiteralTypes, value: T): Literal<T> {
    return new Literal(type, value);
}

export function num(value: number): NumberNode {
    return literal("number", value);
}

export function str(value: string): StringNode {
    return literal("string", value);
}

export function funcall(fun: Expr, ...args: Expr[]): FunCall {
    return new FunCall(fun, args);
}

export function accessor(primary: Expr, ...accessors: Accessor[]): AccessorExpr {
    return new AccessorExpr(primary, accessors);
}

export function method_call(name: Identifier, ...args: Expr[]): MethodCall {
    return new MethodCall(name, args);
}

export function binexpr(repr: string, left: Expr, right: Expr): BinExpr {
    return new BinExpr(repr, left, right);
}