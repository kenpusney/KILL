type Tag = string

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

type LiteralTypes = string

export class Literal<T> implements Expr{
    tag: Tag = "literal"
    type: LiteralTypes
    value: T
}

type NumberNode = Literal<number>

type StringNode = Literal<string>

class AccessorExpr implements Expr {
    tag: Tag = "accessor"
    primary: Expr
    accessors: Accessor[]
}

type Accessor = Identifier | MethodCall | Literal<any>

class MethodCall implements AstNode {
    tag: Tag = "method_call"
    name: Identifier
    args: Expr[]
}

class FunCall implements Expr {
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
