var mime = require('mime');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var compressors = {
    'application/javascript': require('./js'),
    'text/css': require('./css'),
    'image/png': require('./image')
};


module.exports.transform = function (inputPath, outputPath, relativePath, fileStats, next) {
    var fullSourcePath = path.join(inputPath, relativePath, fileStats.name);
    var mimeType = mime.lookup(fullSourcePath);
    var destinationBase = path.join(outputPath, relativePath);
    var fullDestinationPath = path.resolve(path.join(destinationBase, fileStats.name));

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Create the directory if it doesn't exist //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    // This should be fast so just do it sync and avoid complexity
    mkdirp.sync(destinationBase);


    // ~~~~~~~~~~~~~~~~ //
    // Process the file //
    // ~~~~~~~~~~~~~~~~ //

    var compressor = compressors[mimeType];

    // Straight copy if there is no compressor for it
    if (!compressor) {
        fs.createReadStream(fullSourcePath).pipe(fs.createWriteStream(fullDestinationPath));
        next();
        return;
    }

    // Compress the file and write the new one
    compressor.process(inputPath, relativePath, fileStats, mimeType, function (err, buffer) {
        if (err) {
            console.error('Error processing file', err);
            next();
            return;
        }

        // We're already async so just write sync
        fs.writeFileSync(fullDestinationPath, buffer);
        next();
    });
};
