var path = require('path');
var csso = require('csso');
var fs = require('fs');

module.exports.process = function (inputPath, relativePath, fileStats, mimeType, callback) {
    var fullPath = path.join(inputPath, relativePath, fileStats.name);

    fs.readFile(fullPath, function (err, buffer) {
        var compressedCss = csso.minify(buffer.toString()).css;

        callback(null, compressedCss);
    });
};

