var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var config = require('../config').browserify;

gulp.task('browserify', function () {
    var bundleConfig = config.bundleConfigs;

    var bundler = browserify({
        cache: {}, packageCache: {}, fullPaths: false,
        entries: bundleConfig.entries,
        extensions: config.extensions,
        debug: config.debug
    });

    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source(bundleConfig.outputName))
            .pipe(gulp.dest(bundleConfig.dest));
    };

    bundler.transform(babelify.configure({stage: 1}));

    if (global.isWatching) {
        bundler = watchify(bundler);
        bundler.on('update', bundle);
    }

    return bundle();
});
