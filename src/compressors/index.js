var mime = require('mime');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var compressors = [
    require('./image'),
    require('./css'),
    require('./js')
];

module.exports.transform = function (fullDirectoryPath, relativePath, fileStats, next) {
    var fullPath = path.join(fullDirectoryPath, relativePath, fileStats.name);
    var mimeType = mime.lookup(fullPath);
    var numParsers = 0;

    var compress = function (i) {
        var compressor = compressors[i];

        if (!compressor) {
            // We done
            if (numParsers === 0) {
                // No compressors found
            }

            return next();
        }

        if (!mimeType.match(compressor.mimeTypes)) {
            // Skip this compressor
            return compress(i + 1);
        }

        numParsers++;

        compressor.process(fullDirectoryPath, relativePath, fileStats, mimeType, function (err, buffer) {
            if (err) {
                console.warn('ERROR', err);
            } else {
                var newBase = path.join('./_slim', relativePath);
                var newPath = path.resolve(path.join(newBase, fileStats.name));

                mkdirp(newBase, function () {
                    fs.writeFile(newPath, buffer, function () {
                        console.log('WROTE', fileStats.name);
                    });
                });
            }
        });

        // Next one, before the other one even finishes.
        compress(i + 1);
    };

    compress(0);
};