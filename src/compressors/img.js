var imagemin = require('imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');

module.exports.fileType = 'Image';

module.exports.process = function (buffer, callback) {
    imagemin.buffer(buffer, {
        plugins: [
            imageminGifsicle(),
            imageminJpegtran(),
            imageminOptipng(),
            imageminSvgo()
        ]
    }).then(function (data) {
        callback(null, data);
    });
};

