const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

module.exports.mimeTypes = /^image\/png$/;

module.exports.process = function (fullDirectoryPath, relativePath, fileStats, mimeType, callback) {
    var fullPath = path.join(fullDirectoryPath, relativePath, fileStats.name);
    console.log('Got image', fullPath);

    imagemin([fullPath], {
        plugins: [
            imageminMozjpeg({targa: true}),
            imageminPngquant({quality: '65-80'})
        ]
    }).then(function (data) {
        callback(null, data[0].data);
    });
};

