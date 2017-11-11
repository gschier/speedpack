var mime = require('mime');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var compressors = [
    [require('./js'), /^(application|text)\/javascript$/],
    [require('./css'), /^text\/css$/],
    [require('./img'), /^image\/.*$/],
    [require('./xml'), /^(application|text)\/xml$/],

    // Catch-all that just copies the file
    [require('./copier'), /.*/]
];


module.exports.transform = function (inputPath, outputPath, relativePath, fileStats, callback) {
    var fullSourcePath = path.join(inputPath, relativePath, fileStats.name);
    var mimeType = mime.lookup(fullSourcePath);


    // ~~~~~~~~~~~~~~~~~~~~~~ //
    // Setup output directory //
    // ~~~~~~~~~~~~~~~~~~~~~~ //

    var fullDestinationPath = null;
    if (outputPath) {
        var destinationBase = path.join(outputPath, relativePath);

        // This should be fast so just do it sync and avoid complexity
        mkdirp.sync(destinationBase);
        fullDestinationPath = path.resolve(path.join(destinationBase, fileStats.name));
    }


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
        compressor.process(inputBuffer, fullSourcePath, function (err, outputs) {
            if (err) {
                console.error('Error processing file', err);
                return next();
            }

            outputs = Array.isArray(outputs) ? outputs : [outputs];

            var bytesWritten = 0;

            for (var i = 0; i < outputs.length; i++) {
                if (fullDestinationPath) {
                    fs.writeFileSync(fullDestinationPath, outputs[i]);
                } else {
                    // Must be a dry-run
                }
                bytesWritten += outputs[i].byteLength || outputs[i].length;
            }

            // We're done
            callback(null, compressor, inputBuffer.byteLength, bytesWritten);
        });
    });
};
