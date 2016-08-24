var path = require('path');
var fs = require('fs');
var UglifyJS = require('uglify-js');

module.exports.fileType = 'JavaScript';

module.exports.process = function (buffer, callback) {
    var result = UglifyJS.minify(buffer.toString(), {fromString: true});
    callback(null, result.code);
};

