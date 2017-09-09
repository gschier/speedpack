var imagemin = require('imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminSvgo = require('imagemin-svgo');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

module.exports.fileType = 'Image';

module.exports.process = function (buffer, fullPath, callback) {
    imagemin.buffer(buffer, {
        plugins: [
            imageminGifsicle(),
            imageminSvgo(),
            imageminMozjpeg({}),
            imageminPngquant({quality: '65-80'})
        ]
    }).then(function (data) {
        callback(null, data);
    }, function (err) {
        console.warn('Failed to compress image. Leaving as is:', err);
        callback(null, buffer);
    });
};

