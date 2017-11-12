var minify = require('html-minifier').minify;

module.exports.fileType = 'HTML';

module.exports.process = function (buffer, fullPath, callback) {
    return callback(null, minify(buffer.toString(), {
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      removeEmptyAttributes: true,
      collapseWhitespace: true
    }));
};

