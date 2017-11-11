var pd = require('pretty-data').pd;

module.exports.fileType = 'XML';

module.exports.process = function (buffer, fullPath, callback) {
    return callback(null, pd.xmlmin(buffer.toString(), false));
};

