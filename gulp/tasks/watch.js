var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['build'], function () {
    gulp.watch(config.watch.src + '/**', ['build']);
});
