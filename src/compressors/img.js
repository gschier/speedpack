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
      imageminPngquant({ quality: [0.65, 0.8] }),
    ],
  }).then(function (data) {
    callback(null, data);
  }, function (err) {
    console.log('Failed to compress image. Leaving as is:', err);
    callback(null, buffer);
  });
};

