var src = './src';
var dest = './build';

module.exports = {
    watch: {
        src: src
    },
    browserify: {
        debug: true,
        bundleConfigs: [{
            entries: src + '/index.js',
            dest: dest,
            outputName: 'waifu2x.js'
        }]
    }
};
