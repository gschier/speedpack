var program = require('commander');
var path = require('path');
var walk = require('walk');
var compressors = require('./compressors');
var ProgressBar = require('progress');
var version = require('../package.json').version;
var filesize = require('file-size');


module.exports.go = function () {


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Configure the arguments parsing //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    program
        .version(version, '-v, --version')
        .usage('[options] <input>')
        .option('-o, --output <path>', 'output directory', '_slim')
        .option('-c, --config <path>', 'specify configuration file')
        .option('--dry-run', 'don\'t write anything')
        .parse(process.argv);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Set up the directory to work on //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    var inputPath = program.args[0];
    var outputPath = program.output || program.args[1];
    var isDryRun = program.dryRun;
    var startTime = Date.now();

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
            width: 40,
            complete: '#',
            incomplete: '-'
        });

        var completed = 0;
        var tracker = {};
        var totalCount = 0;
        var totalReadBytes = 0;
        var totalWrittenBytes = 0;

        for (var i = 0; i < allPaths.length; i++) {
            var info = allPaths[i];

            compressors.transform(
                inputPath,
                isDryRun ? null : outputPath,
                info.relativePath,
                info.fileStats,
                function (err, compressor, bytesRead, bytesWritten) {
                    progress.tick();

                    if (!tracker.hasOwnProperty(compressor.fileType)) {
                        tracker[compressor.fileType] = {
                            count: 0,
                            readBytes: 0,
                            writtenBytes: 0
                        };
                    }

                    tracker[compressor.fileType].count++;
                    tracker[compressor.fileType].readBytes += bytesRead;
                    tracker[compressor.fileType].writtenBytes += bytesWritten;
                    totalReadBytes += bytesRead;
                    totalWrittenBytes += bytesWritten;
                    totalCount++;

                    if (++completed !== allPaths.length) {
                        // Not done yet
                        return;
                    }

                    // We're done!
                    console.log('Finished in ' + (Date.now() - startTime) + 'ms');
                    if (isDryRun) {
                        console.log('No files written (dry run)');
                    } else {
                        var relPath = path.relative('.', outputPath);
                        console.log('Output written to ' + relPath);
                    }

                    console.log('Compressed:');

                    for (var fileType in tracker) {
                        printFileTypeResult(fileType, tracker[fileType]);
                    }


                    console.log('  -------------------------------');
                    printFileTypeResult('Total', {
                        writtenBytes: totalWrittenBytes,
                        readBytes: totalReadBytes,
                        count: totalCount
                    });
                }
            );
        }
    });
};

function printFileTypeResult (fileType, result) {
    var bytesSaved = result.readBytes - result.writtenBytes
    var storageSaved = filesize(bytesSaved).human('jedec');
    var percentSaved = bytesSaved ? (result.writtenBytes / result.readBytes).toFixed(3) : '0';

    console.log(
        '  ' + fileType + ': ' + result.count +
        ' -> saved ' + storageSaved + ' (' + percentSaved + '%)'
    );
}
