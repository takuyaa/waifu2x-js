var gulp        = require('gulp');
var config      = require('../config').build;
var browserSync = require('browser-sync');

gulp.task('build', ['browserify'], function() {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
