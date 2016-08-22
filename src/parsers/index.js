var mime = require('mime');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var parsers = [
    require('./image')
];

module.exports.transform = function (fullDirectoryPath, relativePath, fileStats, next) {
    var fullPath = path.join(fullDirectoryPath, relativePath, fileStats.name);
    var mimeType = mime.lookup(fullPath);

    var parse = function (i) {
        var parser = parsers[i];

        if (!parser) {
            // We done
            return next();
        }

        if (!mimeType.match(parser.mimeTypes)) {
            // Skip this parser
            return parse(i + 1);
        }

        parser.process(fullDirectoryPath, relativePath, fileStats, mimeType, function (err, buffer) {
            if (err) {
                console.warn('ERROR', err);
            } else {
                var newBase = path.join('./_out', relativePath);
                var newPath = path.resolve(path.join(newBase, fileStats.name));

                mkdirp(newBase, function () {
                    fs.writeFile(newPath, buffer, function () {
                        console.log('WROTE TO', newPath);
                    });
                });
            }
        });

        // Next one, before the other one even finishes.
        parse(i + 1);
    };

    parse(0);
};