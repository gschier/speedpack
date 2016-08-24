var path = require('path');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

module.exports.process = function (inputPath, relativePath, fileStats, mimeType, callback) {
    var fullPath = path.join(inputPath, relativePath, fileStats.name);

    imagemin([fullPath], {
        plugins: [
            imageminMozjpeg({targa: true}),
            imageminPngquant({quality: '65-80'})
        ]
    }).then(function (data) {
        callback(null, data[0].data);
    });
};

