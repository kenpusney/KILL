
import "./visitor"

import "./ast"


import "chai"

import { expect } from "chai";
import { PrintIdVisitor } from "./visitor";
import { ident, literal } from "./ast";

let visitor = new PrintIdVisitor(node => console.log(node));

describe("Visitors", () => {
    it("should successfully print identifier", () => {
        visitor.visit(ident("abc"));
    })


    it("should ignore literals", () => {
        visitor.visit(literal("string", 1))
    })
})