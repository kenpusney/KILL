import parser = require("./kill.parser.js");

export default class Parser {
    private parser: any;

    constructor() {
        this.parser = parser;
    }

    parse(source: string): any {
        return this.parser.parse(source);
    }
}