/*
 * Simple compressor that does absolutely nothing
 */

module.exports.fileType = 'File';

module.exports.process = function (buffer, fullPath, callback) {
    callback(null, buffer);
};

