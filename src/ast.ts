export type Tag = string

export interface AstNode {
    tag: Tag
}

export class Statement implements AstNode {
    tag: Tag = "statement"
    statement: Decl | Expr
    comment: string
}

export interface Decl extends AstNode {
}

export class LetBinding {
    tag: Tag = "let"
    bindings: Binding[]
}

export interface Expr extends AstNode {
}

export class Binding implements Expr {
    tag: Tag = "binding"
    variable: Identifier
    expr: Expr
}

export class Identifier implements Expr {
    tag: Tag = "id"
    repr: string
}

export type LiteralTypes = string

export class Literal<T> implements Expr{
    tag: Tag = "literal"
    type: LiteralTypes
    value: T
}

export type NumberNode = Literal<number>

export type StringNode = Literal<string>

export class AccessorExpr implements Expr {
    tag: Tag = "accessor"
    primary: Expr
    accessors: Accessor[]
}

export type Accessor = Identifier | MethodCall | Literal<any>

export class MethodCall implements AstNode {
    tag: Tag = "method_call"
    name: Identifier
    args: Expr[]
}

export class FunCall implements Expr {
    tag: Tag = "funcall"
    fun: Expr
    args: Expr[]
}

export function stmt(statement: Decl | Expr, comment = null): Statement {
    return {
        tag: "statement",
        statement,
        comment
    }
}

export function letb(...bindings: Binding[]): LetBinding {
    return {
        tag: "let",
        bindings,
    }
}

export function binding(variable: Identifier, expr: Expr): Binding {
    return {
        tag: "binding",
        variable,
        expr
    }
}

export function ident(repr: string): Identifier {
    return {
        tag: "id",
        repr,
    }
}

export function literal<T>(type: LiteralTypes, value: T): Literal<T> {
    return {
        tag: "literal",
        type,
        value
    }
}

export function num(value: number): NumberNode {
    return literal("number", value);
}

export function str(value: string): StringNode {
    return literal("string", value);
}

export function funcall(fun: Expr, ...args: Expr[]): FunCall {
    return {
        tag: "funcall",
        fun,
        args,
    }
}

export function accessor(primary: Expr, ...accessors: Accessor[]): AccessorExpr {
    return {
        tag: "accessor",
        primary,
        accessors
    }
}

export function method_call(name: Identifier, ...args: Expr[]): MethodCall {
    return {
        tag: "method_call",
        name,
        args
    }
}

export class Operator implements Expr {
    tag: string = "operator"
    repr: string
    left: Expr
    right: Expr
}

export function optr(repr: string, left: Expr, right: Expr): Operator {
    return {
        tag: "operator",
        repr, left, right
    }
}