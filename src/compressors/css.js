var path = require('path');
var csso = require('csso');
var fs = require('fs');

module.exports.mimeTypes = /^text\/css$/;

module.exports.process = function (fullDirectoryPath, relativePath, fileStats, mimeType, callback) {
    var fullPath = path.join(fullDirectoryPath, relativePath, fileStats.name);

    fs.readFile(fullPath, function (err, buffer) {
        var compressedCss = csso.minify(buffer.toString()).css;

        callback(null, compressedCss);
    });
};

