var csso = require('csso');

module.exports.fileType = 'CSS';

module.exports.process = function (buffer, callback) {
    var results = csso.minify(buffer.toString(), {sourceMap: 'file'});
    var minified = results.css;
    var sourceMap = results.map.toString();

    callback(null, minified);
};
