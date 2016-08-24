var program = require('commander');
var path = require('path');
var walk = require('walk');
var compressors = require('./compressors');
var ProgressBar = require('progress');
var version = require('../package.json').version;


module.exports.go = function () {


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Configure the arguments parsing //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    program
        .version(version, '-v, --version')
        .option('-o, --output <path>', 'Output directory', '_slim')
        .option('-i, --input <path>', 'Input directory')
        .option('-c, --config <path>', 'Secify configuration file')
        .option('--overwrite', 'Allow overwriting of output directory')
        .parse(process.argv);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Set up the directory to work on //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    var outputPath = program.output || program.args[0];
    var inputPath = program.input || program.args[1];

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

    console.time('pack');
    walker.on('end', function () {
        var progress = new ProgressBar('packing [:bar] :percent', {
            total: allPaths.length,
            complete: '#',
            incomplete: '-'
        });

        var completed = 0;
        for (var i = 0; i < allPaths.length; i++) {
            var info = allPaths[i];

            compressors.transform(
                inputPath,
                outputPath,
                info.relativePath,
                info.fileStats,
                function () {
                    progress.tick();
                    if (++completed === allPaths.length) {
                        console.timeEnd('pack');
                    }
                }
            );
        }
    });
};
