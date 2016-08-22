var yargs = require('yargs');
var path = require('path');
var walk = require('walk');
var parsers = require('./parsers');


module.exports.go = function () {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Configure the arguments parsing //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    yargs
        .help('help')
        .alias('help', 'h', '?  ')
        .options({
            'dir': {
                alias: 'd',
                type: 'string',
                describe: 'Path of directory to transform'
            }
        })
        .check(function (argv) {
            if (!argv._[0] && !argv.dir) {
                throw new Error('Please specify a directory');
            } else {
                return true;
            }
        }).strict();

    var argv = yargs.argv;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // Set up the directory to work on //
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    var directory = argv._[0] || argv.dir;
    var fullDirectoryPath = path.resolve(directory);


    // ~~~~~~~~~~~~~~~~~~ //
    // Recurse over files //
    // ~~~~~~~~~~~~~~~~~~ //

    var walker = walk.walk(fullDirectoryPath, {});

    walker.on('file', function (root, fileStats, next) {
        var relativePath = path.relative(fullDirectoryPath, root);
        parsers.transform(fullDirectoryPath, relativePath, fileStats, next);
    });

    walker.on('errors', function (root, nodeStatsArray, next) {
        console.error('ERROR', root, nodeStatsArray, next);
        next();
    });

    walker.on('end', function () {
        console.log('all done');
    });
};
