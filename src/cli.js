var program = require('commander');
var path = require('path');
var walk = require('walk');
var compressors = require('./compressors');
var ProgressBar = require('progress');
var version = require('../package.json').version;


module.exports.go = function () {


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Initialize some useful variables //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    var startTime = Date.now();


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Configure the arguments parsing //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    program
        .version(version, '-v, --version')
        .usage('[options] <input>')
        .option('-o, --output <path>', 'output directory', '_slim')
        .option('-c, --config <path>', 'specify configuration file')
        .parse(process.argv);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Set up the directory to work on //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    var inputPath = program.args[0];
    var outputPath = program.output || program.args[1];

    if (!inputPath) {
        console.log('Input path not specified');
        process.exit(1);
    }

    inputPath = path.resolve(inputPath);
    outputPath = path.resolve(outputPath);


    // ~~~~~~~~~~~~~~~~~~ //
    // Recurse over files //
    // ~~~~~~~~~~~~~~~~~~ //

    var walker = walk.walk(inputPath, {});

    var allPaths = [];
    walker.on('file', function (root, fileStats, next) {
        var relativePath = path.relative(inputPath, root);

        allPaths.push({
            relativePath: relativePath,
            fileStats: fileStats
        });

        next();
    });

    walker.on('errors', function (root, nodeStatsArray, next) {
        console.error('ERROR', root, nodeStatsArray, next);
        next();
    });

    walker.on('end', function () {
        var progress = new ProgressBar('packing [:bar] :percent', {
            total: allPaths.length,
            width: 20,
            complete: '#',
            incomplete: '-'
        });

        var completed = 0;
        var tracker = {};
        var totalCount = 0;
        var totalBytesSaved = 0;

        for (var i = 0; i < allPaths.length; i++) {
            var info = allPaths[i];

            compressors.transform(
                inputPath,
                outputPath,
                info.relativePath,
                info.fileStats,
                function (err, compressor, bytesSaved) {
                    progress.tick();

                    if (!tracker.hasOwnProperty(compressor.fileType)) {
                        tracker[compressor.fileType] = {
                            count: 0,
                            bytesSaved: 0
                        };
                    }

                    tracker[compressor.fileType].count++;
                    tracker[compressor.fileType].bytesSaved += bytesSaved;
                    totalCount++;
                    totalBytesSaved += bytesSaved;

                    if (++completed !== allPaths.length) {
                        // Not done yet
                        return;
                    }

                    // We're done!
                    console.log('Finished in ' + (Date.now() - startTime) + 'ms');
                    console.log('Compressed:');

                    for (var fileType in tracker) {
                        console.log(
                            '  ' + fileType + ': ' + tracker[fileType].count +
                                ' -> saved ' + tracker[fileType].bytesSaved + ' bytes'
                        );
                    }

                    console.log('  -------------------------------');
                    console.log(
                        '  Total: ' + totalCount + ' -> saved ' +
                        totalBytesSaved + ' bytes'
                    );
                }
            );
        }
    });
};
