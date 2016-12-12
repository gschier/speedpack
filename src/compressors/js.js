var UglifyJS = require('uglify-js');

module.exports.fileType = 'JavaScript';

module.exports.process = function (buffer, fullPath, callback) {
    var str = buffer.toString();

    // Guess if already compressed
    if (fullPath.match(/\.min\.js$/) || str.split('\n').length < 10) {
        return callback(null, str);
    }

    var result = UglifyJS.minify(buffer.toString(), {fromString: true});
    callback(null, result.code);
};

