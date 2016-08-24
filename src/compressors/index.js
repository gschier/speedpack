var mime = require('mime');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var compressors = [
    [require('./js'), /^(application|text)\/javascript$/],
    [require('./css'), /^text\/css$/],
    [require('./img'), /^image\/.*$/],

    // Catch-all that just copies the file
    [require('./copier'), /.*/]
];


module.exports.transform = function (inputPath, outputPath, relativePath, fileStats, callback) {
    var fullSourcePath = path.join(inputPath, relativePath, fileStats.name);
    var mimeType = mime.lookup(fullSourcePath);
    var destinationBase = path.join(outputPath, relativePath);
    var fullDestinationPath = path.resolve(path.join(destinationBase, fileStats.name));


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Create the directory if it doesn't exist //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // This should be fast so just do it sync and avoid complexity
    mkdirp.sync(destinationBase);


    // ~~~~~~~~~~~~~~~~~ //
    // Find a compressor //
    // ~~~~~~~~~~~~~~~~~ //

    var compressor = null;
    for (var i = 0; i < compressors.length; i++) {
        if (mimeType.match(compressors[i][1])) {
            compressor = compressors[i][0];
            break;
        }
    }


    // ~~~~~~~~~~~~~~~~ //
    // Process the file //
    // ~~~~~~~~~~~~~~~~ //

    // Start reading the file
    fs.readFile(fullSourcePath, function (err, inputBuffer) {
        // Compress the file and write the new one
        compressor.process(inputBuffer, function (err, outputs) {
            if (err) {
                console.error('Error processing file', err);
                return next();
            }

            outputs = Array.isArray(outputs) ? outputs : [outputs];

            var bytesWritten = 0;
            var numWritten = 0;

            for (var i = 0; i < outputs.length; i++) {
                (function (original) {
                    fs.writeFile(fullDestinationPath, outputs[i], function (err) {
                        if (!err) {
                            bytesWritten += original.byteLength || original.length;
                        }

                        if (++numWritten === outputs.length) {
                            // We're done
                            var bytesSaved = inputBuffer.byteLength - bytesWritten;
                            callback(null, compressor, bytesSaved);
                        }
                    });
                })(outputs[i]);
            }
        });
    });
};
