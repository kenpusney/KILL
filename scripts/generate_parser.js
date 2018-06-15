
var watch = require('node-watch');
var PEG = require('pegjs');
var fs = require('fs');
var pj = require("prettyjson")


watch(__dirname + "/../kill.v2.pegjs", {}, function(evt, name) {
    console.log("%s changed.", name);

    try {
        fs.writeFileSync(__dirname + "/../src/kill.parser.js", PEG.generate(fs.readFileSync(name, "utf8"), {
            output: "source",
            format: "commonjs"
        }));
    } catch (error) {
        console.log("error %s occoured", error);
        console.log(pj.render(error));
        return;
    }

    console.log("%s parser file generated", name);
})