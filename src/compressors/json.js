var jsonminify = require("jsonminify");

module.exports.fileType = 'JSON';

module.exports.process = function (buffer, fullPath, callback) {
    return callback(null, jsonminify(buffer.toString()));
};

