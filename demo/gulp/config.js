var src  = './src';
var dest = './build';
var node_modules = './node_modules';

module.exports = {
    watch: {
        src: src + '/**'
    },
    build: {
        src: src + '/www/**',
        dest: dest
    },
    browserSync: {
        server: {
            baseDir: dest
        }
    },
    browserify: {
        debug: true,
        bundleConfigs: {
            entries: src + '/app/app.jsx',
            dest: dest + '/js',
            outputName: 'app.js'
        }
    }
};
