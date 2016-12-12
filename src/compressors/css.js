var csso = require('csso');

module.exports.fileType = 'CSS';

module.exports.process = function (buffer, fullPath, callback) {
    var str = buffer.toString();

    // Guess if already compressed
    if (fullPath.match(/\.min\.css$/) || str.split('\n').length < 10) {
        return callback(null, str);
    }

    var results = csso.minify(str, {sourceMap: 'file'});

    callback(null, results.css);
};
