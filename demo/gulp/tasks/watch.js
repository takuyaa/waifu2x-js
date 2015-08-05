var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(config.watch.src, ['build']);
});
