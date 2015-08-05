importScripts('/js/waifu2x.js');

var Waifu2x = self.Waifu2x;

self.onmessage = function(e) {
    console.log("Waifu2x params:", e.data);

    var waifu2x = new Waifu2x({
        scale2xModel: e.data.scale2xModel,
        noiseModel: e.data.noiseModel,
        scale: e.data.scale
    });

    var imageData = e.data.imageData;
    waifu2x.calc(imageData.data, imageData.width, imageData.height, function(image2x, width, height) {
        self.postMessage({
            command: 'result',
            image2x: image2x,
            width: width,
            height: height
        });
    }, function(phase, doneRatio, allBlocks, doneBlocks) {
        self.postMessage({
            command: 'progress',
            phase: phase,
            doneRatio: doneRatio,
            allBlocks: allBlocks,
            doneBlocks: doneBlocks
        });
    });
};
