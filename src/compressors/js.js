var path = require('path');
var fs = require('fs');
var UglifyJS = require('uglify-js');

module.exports.process = function (inputPath, relativePath, fileStats, mimeType, callback) {
    var fullPath = path.join(inputPath, relativePath, fileStats.name);

    fs.readFile(fullPath, function (err, buffer) {
        var compressed = UglifyJS.minify(buffer.toString(), {fromString: true}).code;

        callback(null, compressed);
    });
};

