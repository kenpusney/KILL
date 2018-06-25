

import "chai"

import Parser from "./Parser"
import {render} from "prettyjson"
import { expect } from "chai";

import {
    stmt, letb, binding, ident, num, 
    str, funcall, accessor, method_call, binexpr
} from "./ast"

const parser = new Parser();

describe("Grammar", () => {
    it("should parse let binding", () => {
        let result = parser.parse("let x := 1");

        expect(result).eql([stmt(letb(binding(ident("x"), num(1))))])
    });

    it("should parse let binding with newline at end", () => {
        let result = parser.parse("let x := 1\n");

        expect(result).eql([stmt(letb(binding(ident("x"), num(1))))])
    });

    it("should parse multiple let bindings", () => {
        let result = parser.parse("let x := 1\nlet y := 2");

        expect(result).eql([
            stmt(letb(binding(ident("x"), num(1)))),
            stmt(letb(binding(ident("y"), num(2))))
        ]);
    });

    it("should parse let bindings with multiple line-ends", () => {
        let result = parser.parse("let x := 1\n\n\n\n\n\n\n");

        expect(result).eql([stmt(letb(binding(ident("x"), num(1))))])
    });

    it("should parse function call expression", () => {
        let result = parser.parse("hello(world)");

        expect(result).eql([
            stmt(funcall(ident("hello"), ident("world")))
        ])
    });

    it("should parse access expr", () => {
        let result = parser.parse("hello#world(howAreYou)#name");

        expect(result).eql([
            stmt(accessor(ident("hello"), method_call(ident("world"), ident("howAreYou")), ident("name")))
        ])

    })

    it("should parse literals", () => {
        let result = parser.parse(`"abc"\n123\n`)

        expect(result).eql([
            stmt(str("abc")),
            stmt(num(123))
        ])
    })

    it("should parse operator", () => {
        let result = parser.parse("a + b");

        expect(result).eql([
            stmt(binexpr("+", ident("a"), ident("b")))
        ])
    })

    it("should parse fexp and aexp as correct order", () => {
        let result = parser.parse("hello#world - hello#hello + hello(world) * hello#world(hello)")

        expect(result).eql([
            stmt(
                binexpr("*", 
                    binexpr("+", 
                        binexpr("-", 
                            accessor(ident("hello"), ident("world")), 
                            accessor(ident("hello"), ident("hello"))),
                        funcall(ident("hello"), ident("world"))),
                    accessor(ident("hello"), method_call(ident("world"), ident("hello")))))
        ])
    })

})