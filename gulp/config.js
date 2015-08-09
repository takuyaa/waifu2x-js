var src = './src';
var dest = './build';

module.exports = {
    watch: {
        src: src
    },
    babel: {
        src: src,
        dest: dest + '/node'
    },
    browserify: {
        debug: true,
        bundleConfigs: [{
            entries: src + '/index.js',
            dest: dest + '/browser',
            outputName: 'waifu2x.js'
        }]
    }
};
