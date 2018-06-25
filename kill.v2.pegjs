{

function Token(tag, value=undefined, isKeyword = false, isOperator = false) {
	this.tag = tag;
    this.value = value || [];
    this.isKeyword = isKeyword;
    this.isOperator = isOperator;
};

function pair(left, right) {
    return {
        tag: "pair",
        type: "pair",
        left: left, 
        right: right
    }
}

function node_ident(repr) {
    return {
        tag: "id",
        repr: repr
    }
}

function node_number(val) {
    return {
        tag: "literal",
        type: "number",
        value: val
    }
}

function node_string(val) {
    return {
        tag: "literal",
        type: "string",
        value: val
    }
}

function node_boolean(val) {
    return {
        tag: "literal",
        type: "string",
        value: val
    }
}

function node_unit() {
    return {
        tag: "literal",
        type: "unit",
        value: undefined
    }
}

function node_binexpr(repr, left, right) {
    return {
        tag: "binexpr",
        repr: repr,
        left: left,
        right: right
    }
}

function node_condition(condition, consequence, alternative) {
    return {
        tag: "condition",
        condition: condition,
        consequence: consequence,
        alternative: alternative
    }
}


function node_function(name, params, body) {
    return {
        tag: "function",
        name: name,
        params: params,
        body: body
    }
}

function node_lambda(params, body) {
    return {
        tag: "lambda",
        type: "function",
        params: params,
        body: body
    }
}

function node_accessor(primary, accessors) {
    return {
        tag: "accessor",
        primary: primary,
        accessors: accessors
    }
}

function node_method_call(name, args) {
    return {
        tag: "method_call",
        name: name,
        args: args
    }
}

function node_funcall(fun, args) {
    return {
        tag: "funcall",
        fun: fun,
        args: args
    }
}

function node_comprehension(expr, binding) {
    return {
        tag: "comprehension",
        expr: expr,
        binding: binding
    }
};

function node_statements(statements) {
    return {
        tag: "statements",
        statements: statements
    }
}

function node_statement(statement, comment) {
    return {
        tag: "statement",
        statement: statement,
        comment: comment
    }
}

function node_comment(comment) {
    return {
        tag: "comment",
        comment: comment
    }
}

function node_exprlist(exprs) {
    return {
        tag: "exprlist",
        exprs: exprs
    }
}

function node_letbinding(bindings) {
    return {
        tag: "let",
        bindings: bindings
    }
}

function node_binding(variable, expr) {
    return {
        tag: "binding",
        variable: variable,
        expr: expr
    }
}

var keywords = [
    "let", "in", 
    "if", "else", "then", "end", 
    "lambda",
    "true", "false"
];
var reserved_symbols = [":=", "->", "#", ":", "|"];

var escape_mapping = {
    'e': "\e",
    "t": "\t",
    "\\": "\\",
    "n": "\n",
    "r": "\r",
    "b": "\b"
};

function keyword(tag) {
    keywords.push(tag);
    return function(value = undefined) {
        return new Token(tag, value, true, false)
    };
}

function util_concat(l, r) {
    if (r) {
        return l.concat(r)
    }
    return l;
}

function util_leftmost(op, ex) {
    while(op.left) {
    	op = op.left
    }
    op.left = ex
}

var token_lambda = keyword("lambda");

}

start = stmts

blank = [ \t]
newline = "\n"

symbol_let = "let"
symbol_if = "if"
symbol_then = "then"
symbol_else = "else"
symbol_end = "end"
symbol_in = "in"
symbol_comment = ";"
symbol_true = "true"
symbol_false = "false"

op_bind = ":="

op_arrow = "->"

op_access = "#"

delim = "\n"
bnl = blank* newline? blank* { return null }

sep = blank* "," newline? blank* {  }

param = "\\" id:id {return id;}

escaped = "\\" / "\"" / "b" / "e" / "n" / "r" / "t"

unicode_seq = seq:[a-eA-E-0-9]+ {return seq.join("")}

string = "\"" str:string_literal "\"" {return node_string(str);}

string_literal = nd:(non_dquote / escape)* {return nd.join("")}

dquote = "\""

non_dquote= x:[^"\\] {return x;}

escape= "\\" x:escaped {return escape_mapping[x];} /
    "\\u" uni:unicode_seq {return String.fromCodePoint(parseInt(uni, 16));}

unit = "("")" {return node_unit();}

bools = bool:(symbol_true / symbol_false)
{
    return node_boolean(bool === "true");
}

operator=op:[+|<>\-*%\^\&:.?!\/\\~=]+ 
    & {
        if (reserved_symbols.indexOf(op.join("")) > -1) {
            return false;
        }
        return true;
    }
 {return node_binexpr(op.join(""))}

id = id:[_a-zA-Z\-\$]+
  &{
  	 if (keywords.indexOf(id.join("")) > -1) {
     	return false;
     }
     return true;
   }
{return node_ident(id.join(""))}

digits = ds:[0-9]+
{
    return node_number(parseInt(ds.join(""),10));
}

stmts = stmt:stmt delim* stmts:stmts?
  {return util_concat([stmt], stmts)}

stmt = stmt:(decl / exp) comment:comment? {return node_statement(stmt, comment);} / comment

comment = blank* symbol_comment comment:[^\n]* {return node_comment(comment.join(""));}

decl = let

exp =
  if / infixexp

infixexp =
  l:lexp
    {return l}

lexp =
  lambda /
  fexp

if =
  symbol_if bnl cond:fexp bnl symbol_then bnl conseq:exp bnl symbol_else bnl alter:exp
  {return node_condition(cond, conseq, alter);}

fexp = s:sexp bnl bin:binexpr? {
	if (bin) return bin(s);
    return s;
}

sexp = "(" bnl exp:exp bnl ")" { return exp } / funcall / aexp

binexpr = op:operator bnl f:sexp bnl bin:binexpr? {
    return function(left) {
        op.left = left;
        op.right = f
    	if (bin) {
            return bin(op);
        }
        return op;
    }
}

funcall = l:aexp p:enclosed_expr { return node_funcall(l, p) }

enclosed_expr = "(" bnl es:(seperated_expr)? ")" bnl { return es ? es : [] }

seperated_expr = e:exp bnl es:("," bnl ie:exp { return ie })* 
{ return util_concat([e], es); }

list = "[" bnl (seperated_expr)? bnl "]" bnl / comprehension

pair = l:id bnl ":" bnl r:exp { return pair(l, r) } 
    / l:literal bnl ":" bnl r:exp { return pair(l, r) }

object_literal = "{" bnl (pair bnl ("," bnl pair)*)? bnl "}"

aexp = obj:obj acc:accessor_expr*
{
    if (acc && acc.length) {
        return node_accessor(obj, acc);
    }
    return obj
}

let = l:symbol_let bnl bs:bindings
{
	return node_letbinding(bs);
}

bindings =
  b:binding bs:(sep bnl bi:binding {return bi;})*
  {return util_concat([b], bs);}

binding =
  name:id bnl op_bind bnl exp:exp
  {return node_binding(name, exp);}

lambda =
  ps:param? bnl (op_arrow bnl) bnl exp:exp sep?
  {return token_lambda({params: ps?[ps]:[], body: exp});} /
  p:param blank+ exp:exp sep? {return token_lambda({params: [p], body: exp});} /
  p:param bnl l:lambda {return token_lambda({params: [p], body: l})}

literal = digits / bools / unit / list / string / object_literal

obj = literal / id

accessor_expr = op_access method:accessor
{
    if (method == null) {
       error("must specify accessor after #")
    }
    return method;
}

accessor = id:id args:enclosed_expr? { return args ? node_method_call(id, args) : id } / literal

var = id

quote = "(" e:exp es:exp* ")"
  {return es.length? [e].concat(es): [e];}

comprehension = "[" bnl exp:exp bnl newline? bnl"|" bnl bind:in_bindings bnl "]"
{
    return node_comprehension(
    		bind
                .slice(0)
                .reverse()
                .reduce((a,b) => token_lambda({params: [b[0]], body: a}),
                        exp),
    		bind)
}

in_binding =  id:id bnl symbol_in bnl exp:exp cond:(bnl symbol_if bnl expi:exp {return expi;})?
{
    return {name: id, value: exp, condition: cond};
}

in_bindings = i:in_binding ins:(sep ii:in_binding {return ii})*
{
    return [i].concat(ins);
}
