(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Waifu2x = require("./Waifu2x");

var _Waifu2x2 = _interopRequireDefault(_Waifu2x);

(function (global) {
    if ("process" in global) {
        module.exports = _Waifu2x2["default"];
    }
    global.Waifu2x = _Waifu2x2["default"];
})((undefined || 0).self || global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90YWt1eWEtYS93b3Jrc3BhY2Uvd2FpZnUyeC1qcy9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7dUJBQW9CLFdBQVc7Ozs7QUFFL0IsQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUNkLFFBQUksU0FBUyxJQUFJLE1BQU0sRUFBRTtBQUNyQixjQUFNLENBQUMsT0FBTyx1QkFBVSxDQUFDO0tBQzVCO0FBQ0QsVUFBTSxDQUFDLE9BQU8sdUJBQVUsQ0FBQztDQUM1QixDQUFBLENBQUUsQ0FBQyxhQUFRLENBQUMsQ0FBQSxDQUFFLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdhaWZ1MnggZnJvbSAnLi9XYWlmdTJ4JztcblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIGlmIChcInByb2Nlc3NcIiBpbiBnbG9iYWwpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBXYWlmdTJ4O1xuICAgIH1cbiAgICBnbG9iYWwuV2FpZnUyeCA9IFdhaWZ1Mng7XG59KSgodGhpcyB8fCAwKS5zZWxmIHx8IGdsb2JhbCk7XG4iXX0=
},{"./Waifu2x":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChannelImage = (function () {
    function ChannelImage(width, height, buffer) {
        _classCallCheck(this, ChannelImage);

        this.width = width;
        this.height = height;
        this.buffer = new Uint8ClampedArray(width * height);
        if (buffer == null) {
            return;
        }
        if (buffer.length != width * height) {
            throw new Error("Illegal buffer length");
        }
        this.buffer.set(buffer);
    }

    _createClass(ChannelImage, [{
        key: "extrapolation",
        value: function extrapolation(px) {
            console.log("Extrapolating...");
            var width = this.width;
            var height = this.height;
            var to_index = function to_index(w, h) {
                return w + h * width;
            };
            var image_ex = new ChannelImage(width + 2 * px, height + 2 * px);
            for (var h = 0; h < height + px * 2; h++) {
                for (var w = 0; w < width + px * 2; w++) {
                    var index = w + h * (width + px * 2);
                    if (w < px) {
                        // Left outer area
                        if (h < px) {
                            // Left upper area
                            image_ex.buffer[index] = this.buffer[to_index(0, 0)];
                        } else if (px + height <= h) {
                            // Left lower area
                            image_ex.buffer[index] = this.buffer[to_index(0, height - 1)];
                        } else {
                            // Left outer area
                            image_ex.buffer[index] = this.buffer[to_index(0, h - px)];
                        }
                    } else if (px + width <= w) {
                        // Right outer area
                        if (h < px) {
                            // Right upper area
                            image_ex.buffer[index] = this.buffer[to_index(width - 1, 0)];
                        } else if (px + height <= h) {
                            // Right lower area
                            image_ex.buffer[index] = this.buffer[to_index(width - 1, height - 1)];
                        } else {
                            // Right outer area
                            image_ex.buffer[index] = this.buffer[to_index(width - 1, h - px)];
                        }
                    } else if (h < px) {
                        // Upper outer area
                        image_ex.buffer[index] = this.buffer[to_index(w - px, 0)];
                    } else if (px + height <= h) {
                        // Lower outer area
                        image_ex.buffer[index] = this.buffer[to_index(w - px, height - 1)];
                    } else {
                        // Inner area
                        image_ex.buffer[index] = this.buffer[to_index(w - px, h - px)];
                    }
                }
            }
            return image_ex;
        }
    }, {
        key: "resize",
        value: function resize(scale) {
            var width = this.width;
            var height = this.height;
            var scaled_width = Math.round(width * scale);
            var scaled_height = Math.round(height * scale);
            var scaled_image = new ChannelImage(scaled_width, scaled_height);
            for (var w = 0; w < scaled_width; w++) {
                for (var h = 0; h < scaled_height; h++) {
                    var scaled_index = w + h * scaled_width;
                    var w_original = Math.round((w + 1) / scale) - 1;
                    var h_original = Math.round((h + 1) / scale) - 1;
                    var index_original = w_original + h_original * width;
                    scaled_image.buffer[scaled_index] = this.buffer[index_original];
                }
            }
            return scaled_image;
        }
    }], [{
        key: "channelDecompose",
        value: function channelDecompose(image, width, height) {
            var imageR = new ChannelImage(width, height);
            var imageG = new ChannelImage(width, height);
            var imageB = new ChannelImage(width, height);
            var imageA = new ChannelImage(width, height);
            for (var w = 0; w < width; w++) {
                for (var h = 0; h < height; h++) {
                    var index = w + h * width;
                    imageR.buffer[index] = image[w * 4 + h * width * 4];
                    imageG.buffer[index] = image[w * 4 + h * width * 4 + 1];
                    imageB.buffer[index] = image[w * 4 + h * width * 4 + 2];
                    imageA.buffer[index] = image[w * 4 + h * width * 4 + 3];
                }
            }
            return [imageR, imageG, imageB, imageA];
        }
    }, {
        key: "channelCompose",
        value: function channelCompose(imageR, imageG, imageB, imageA) {
            var width = imageR.width;
            var height = imageR.height;
            var image = new Uint8ClampedArray(width * height * 4);
            for (var i = 0; i < width * height; i++) {
                image[i * 4] = imageR.buffer[i];
                image[i * 4 + 1] = imageG.buffer[i];
                image[i * 4 + 2] = imageB.buffer[i];
                image[i * 4 + 3] = 255; //imageA.buffer[i];
            }
            return image;
        }
    }]);

    return ChannelImage;
})();

exports["default"] = ChannelImage;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BLOCK_SIZE = 128;
var OVERLAP = 14;

var ImagePlane = (function () {
    function ImagePlane(width, height, buffer) {
        _classCallCheck(this, ImagePlane);

        this.width = width;
        this.height = height;
        this.buffer = new Float32Array(width * height);
        if (buffer == null) {
            return;
        }
        if (buffer.length != width * height) {
            throw new Error("Illegal buffer length");
        }
        this.buffer.set(buffer);
    }

    _createClass(ImagePlane, [{
        key: "getLength",
        value: function getLength() {
            return this.buffer.length;
        }
    }, {
        key: "getBuffer",
        value: function getBuffer() {
            return this.buffer;
        }
    }, {
        key: "index",
        value: function index(w, h) {
            return w + h * this.width;
        }
    }, {
        key: "getValue",
        value: function getValue(w, h) {
            return this.buffer[this.index(w, h)];
        }
    }, {
        key: "setValue",
        value: function setValue(w, h, v) {
            this.buffer[this.index(w, h)] = v;
        }
    }, {
        key: "getValueIndexed",
        value: function getValueIndexed(i) {
            return this.buffer[i];
        }
    }, {
        key: "setValueIndexed",
        value: function setValueIndexed(i, v) {
            this.buffer[i] = v;
        }
    }], [{
        key: "blocking",

        // blocks overlap 14px each other
        value: function blocking(initialPlanes) {
            var widthInput = initialPlanes[0].width;
            var heightInput = initialPlanes[0].height;

            var blocksW = Math.ceil((widthInput - OVERLAP) / (BLOCK_SIZE - OVERLAP));
            var blocksH = Math.ceil((heightInput - OVERLAP) / (BLOCK_SIZE - OVERLAP));
            var blocks = blocksW * blocksH;

            var inputBlocks = []; // [ [ block0_R, block0_G, block0_B ], [ block1_R, ...] ... ]
            for (var b = 0; b < blocks; b++) {
                var blockIndexW = b % blocksW;
                var blockIndexH = Math.floor(b / blocksW);

                var blockWidth = undefined;
                var blockHeight = undefined;
                if (blockIndexW == blocksW - 1) {
                    blockWidth = widthInput - (BLOCK_SIZE - OVERLAP) * blockIndexW; // right end block
                } else {
                    blockWidth = BLOCK_SIZE;
                }
                if (blockIndexH == blocksH - 1) {
                    blockHeight = heightInput - (BLOCK_SIZE - OVERLAP) * blockIndexH; // bottom end block
                } else {
                    blockHeight = BLOCK_SIZE;
                }

                var channels = [];
                for (var n = 0; n < initialPlanes.length; n++) {
                    channels[n] = new ImagePlane(blockWidth, blockHeight);
                }

                for (var w = 0; w < blockWidth; w++) {
                    for (var h = 0; h < blockHeight; h++) {
                        for (var n = 0; n < initialPlanes.length; n++) {
                            var targetIndexW = blockIndexW * (BLOCK_SIZE - OVERLAP) + w;
                            var targetIndexH = blockIndexH * (BLOCK_SIZE - OVERLAP) + h;
                            var channel = initialPlanes[n];
                            var v = channel.getValue(targetIndexW, targetIndexH);
                            // Below implementation is slow
                            // let targetIndex = targetIndexH * widthInput + targetIndexW;
                            // let v = channel.getValueIndexed(targetIndex);
                            channels[n].setValue(w, h, v);
                        }
                    }
                }
                inputBlocks[b] = channels;
            }
            return [inputBlocks, blocksW, blocksH];
        }
    }, {
        key: "deblocking",

        // [ [ block0_R, block0_G, block0_B ], [ block1_R, ...] ... ]
        value: function deblocking(outputBlocks, blocksW, blocksH) {
            var block_size = outputBlocks[0][0].width;
            var width = 0;
            for (var b = 0; b < blocksW; b++) {
                width += outputBlocks[b][0].width;
            }
            var height = 0;
            for (var b = 0; b < blocksW * blocksH; b += blocksW) {
                height += outputBlocks[b][0].height;
            }
            console.log("result image width:" + width + " height:" + height);
            var outputPlanes = []; // [ planeR, planeG, planeB ]
            for (var b = 0; b < outputBlocks.length; b++) {
                var block = outputBlocks[b];
                var blockIndexW = b % blocksW;
                var blockIndexH = Math.floor(b / blocksW);

                for (var n = 0; n < block.length; n++) {
                    if (outputPlanes[n] == null) {
                        outputPlanes[n] = new ImagePlane(width, height);
                    }
                    var channelBlock = block[n];
                    for (var w = 0; w < channelBlock.width; w++) {
                        for (var h = 0; h < channelBlock.height; h++) {
                            var targetIndexW = blockIndexW * block_size + w;
                            var targetIndexH = blockIndexH * block_size + h;
                            var targetIndex = targetIndexH * width + targetIndexW;
                            var value = channelBlock.getValue(w, h);
                            outputPlanes[n].setValueIndexed(targetIndex, value);
                        }
                    }
                }
            }
            return outputPlanes;
        }
    }]);

    return ImagePlane;
})();

exports["default"] = ImagePlane;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ChannelImage = require('./ChannelImage');

var _ChannelImage2 = _interopRequireDefault(_ChannelImage);

var _ImagePlane = require('./ImagePlane');

var _ImagePlane2 = _interopRequireDefault(_ImagePlane);

var Waifu2x = (function () {
    function Waifu2x(json) {
        _classCallCheck(this, Waifu2x);

        this.scale2xModel = json.scale2xModel;
        this.noiseModel = json.noiseModel;
        this.scale = json.scale;
        this.isDenoising = json.isDenoising;
    }

    _createClass(Waifu2x, [{
        key: 'calc',
        value: function calc(image, width, height, done, progress) {
            if (this.scale2xModel == null && this.noiseModel == null) {
                // do nothing
                done(image, width, height);
            }

            // decompose
            progress('decompose');

            var _ChannelImage$channelDecompose = _ChannelImage2['default'].channelDecompose(image, width, height);

            var _ChannelImage$channelDecompose2 = _slicedToArray(_ChannelImage$channelDecompose, 4);

            var imageR = _ChannelImage$channelDecompose2[0];
            var imageG = _ChannelImage$channelDecompose2[1];
            var imageB = _ChannelImage$channelDecompose2[2];
            var imageA = _ChannelImage$channelDecompose2[3];

            // de-noising
            if (this.noiseModel != null) {
                console.log('Denoising all blocks');

                var _Waifu2x$calcRGB = Waifu2x.calcRGB(imageR, imageG, imageB, this.noiseModel, 1, progress, 'denoise');

                var _Waifu2x$calcRGB2 = _slicedToArray(_Waifu2x$calcRGB, 3);

                imageR = _Waifu2x$calcRGB2[0];
                imageG = _Waifu2x$calcRGB2[1];
                imageB = _Waifu2x$calcRGB2[2];

                console.log('Denoised all blocks');
            }

            // calculate
            if (this.scale2xModel != null) {
                console.log('Scaling all blocks');

                var _Waifu2x$calcRGB3 = Waifu2x.calcRGB(imageR, imageG, imageB, this.scale2xModel, this.scale, progress, 'scale');

                var _Waifu2x$calcRGB32 = _slicedToArray(_Waifu2x$calcRGB3, 3);

                imageR = _Waifu2x$calcRGB32[0];
                imageG = _Waifu2x$calcRGB32[1];
                imageB = _Waifu2x$calcRGB32[2];

                console.log('Scaled all blocks');
            }

            // resize alpha channel
            imageA = this.scale == 1 ? imageA : imageA.resize(this.scale);

            if (imageA.length != imageR.length) {
                throw new Error('A channel image size must be same with R channel image size');
            }

            // recompose
            progress('recompose');
            var image2x = _ChannelImage2['default'].channelCompose(imageR, imageG, imageB, imageA);

            done(image2x, imageR.width, imageR.height);
        }
    }], [{
        key: 'normalize',
        value: function normalize(image) {
            var width = image.width;
            var height = image.height;
            var imagePlane = new _ImagePlane2['default'](width, height);
            if (imagePlane.getBuffer().length != image.buffer.length) {
                throw new Error('Assertion error: length');
            }
            for (var i = 0; i < image.buffer.length; i++) {
                imagePlane.setValueIndexed(i, image.buffer[i] / 255.0);
            }
            return imagePlane;
        }
    }, {
        key: 'denormalize',
        value: function denormalize(imagePlane) {
            var image = new _ChannelImage2['default'](imagePlane.width, imagePlane.height);

            for (var i = 0; i < imagePlane.getBuffer().length; i++) {
                image.buffer[i] = Math.round(imagePlane.getValueIndexed(i) * 255.0);
            }
            return image;
        }
    }, {
        key: 'convolution',
        value: function convolution(inputPlanes, W, nOutputPlane, bias) {
            var width = inputPlanes[0].width;
            var height = inputPlanes[0].height;
            var outputPlanes = [];
            for (var o = 0; o < nOutputPlane; o++) {
                outputPlanes[o] = new _ImagePlane2['default'](width - 2, height - 2);
            }
            var sumValues = new Float32Array(nOutputPlane);
            var biasValues = new Float32Array(nOutputPlane);
            biasValues.set(bias);
            for (var w = 1; w < width - 1; w++) {
                for (var h = 1; h < height - 1; h++) {
                    sumValues.set(biasValues); // leaky ReLU bias
                    for (var i = 0; i < inputPlanes.length; i++) {
                        var i00 = inputPlanes[i].getValue(w - 1, h - 1);
                        var i10 = inputPlanes[i].getValue(w, h - 1);
                        var i20 = inputPlanes[i].getValue(w + 1, h - 1);
                        var i01 = inputPlanes[i].getValue(w - 1, h);
                        var i11 = inputPlanes[i].getValue(w, h);
                        var i21 = inputPlanes[i].getValue(w + 1, h);
                        var i02 = inputPlanes[i].getValue(w - 1, h + 1);
                        var i12 = inputPlanes[i].getValue(w, h + 1);
                        var i22 = inputPlanes[i].getValue(w + 1, h + 1);

                        for (var o = 0; o < nOutputPlane; o++) {
                            // assert inputPlanes.length == params.weight[o].length
                            var weight_index = o * inputPlanes.length * 9 + i * 9;
                            var value = sumValues[o];
                            value += i00 * W[weight_index++];
                            value += i10 * W[weight_index++];
                            value += i20 * W[weight_index++];
                            value += i01 * W[weight_index++];
                            value += i11 * W[weight_index++];
                            value += i21 * W[weight_index++];
                            value += i02 * W[weight_index++];
                            value += i12 * W[weight_index++];
                            value += i22 * W[weight_index++];
                            sumValues[o] = value;
                        }
                    }
                    for (var o = 0; o < nOutputPlane; o++) {
                        var v = sumValues[o];
                        // v += bias[o]; // leaky ReLU bias is already added above
                        if (v < 0) {
                            v *= 0.1;
                        }
                        outputPlanes[o].setValue(w - 1, h - 1, v);
                    }
                }
            }
            return outputPlanes;
        }
    }, {
        key: 'typeW',
        value: function typeW(model) {
            console.log('Initialize typed W matrix');
            var W = [];

            var _loop = function (l) {
                // initialize weight matrix
                var layerWeight = model[l].weight;
                var arrayW = [];
                layerWeight.forEach(function (weightForOutputPlane) {
                    weightForOutputPlane.forEach(function (weightMatrix) {
                        weightMatrix.forEach(function (weightVector) {
                            weightVector.forEach(function (w) {
                                arrayW.push(w);
                            });
                        });
                    });
                });
                var w = new Float32Array(arrayW.length);
                w.set(arrayW);
                W[l] = w;
            };

            for (var l = 0; l < model.length; l++) {
                _loop(l);
            }
            return W;
        }
    }, {
        key: 'calcRGB',
        value: function calcRGB(imageR, imageG, imageB, model, scale, progress, phase) {
            var _map = [imageR, imageG, imageB].map(function (image) {
                var imgResized = scale == 1 ? image : image.resize(scale);

                // extrapolation for layer count (each convolution removes outer 1 pixel border)
                var imgExtra = imgResized.extrapolation(model.length);

                return Waifu2x.normalize(imgExtra);
            });

            var _map2 = _slicedToArray(_map, 3);

            var planeR = _map2[0];
            var planeG = _map2[1];
            var planeB = _map2[2];

            var inputPlanes = [planeR, planeG, planeB];

            // blocking

            var _ImagePlane$blocking = _ImagePlane2['default'].blocking(inputPlanes);

            var _ImagePlane$blocking2 = _slicedToArray(_ImagePlane$blocking, 3);

            var inputBlocks = _ImagePlane$blocking2[0];
            var blocksW = _ImagePlane$blocking2[1];
            var blocksH = _ImagePlane$blocking2[2];

            inputPlanes = null;

            // init W
            var W = Waifu2x.typeW(model);

            var outputBlocks = [];
            for (var b = 0; b < inputBlocks.length; b++) {
                var inputBlock = inputBlocks[b];
                var outputBlock = null;
                for (var l = 0; l < model.length; l++) {
                    var nOutputPlane = model[l].nOutputPlane;

                    // convolution
                    outputBlock = Waifu2x.convolution(inputBlock, W[l], nOutputPlane, model[l]['bias']);
                    inputBlock = outputBlock; // propagate output plane to next layer input
                    inputBlocks[b] = null;
                }
                outputBlocks[b] = outputBlock;
                var doneRatio = Math.round(100 * (b + 1) / inputBlocks.length);
                progress(phase, doneRatio, inputBlocks.length, b + 1);
                console.log('b:' + b + ' is done. ' + Math.round(100 * (b + 1) / inputBlocks.length) + '%');
            }
            inputBlocks = null;

            // de-blocking
            var outputPlanes = _ImagePlane2['default'].deblocking(outputBlocks, blocksW, blocksH);
            if (outputPlanes.length != 3) {
                throw new Error('Output planes must be 3: color channel R, G, B.');
            }

            var _outputPlanes$map = outputPlanes.map(function (outputPlane) {
                return Waifu2x.denormalize(outputPlane);
            });

            var _outputPlanes$map2 = _slicedToArray(_outputPlanes$map, 3);

            imageR = _outputPlanes$map2[0];
            imageG = _outputPlanes$map2[1];
            imageB = _outputPlanes$map2[2];

            return [imageR, imageG, imageB];
        }
    }]);

    return Waifu2x;
})();

exports['default'] = Waifu2x;
module.exports = exports['default'];

},{"./ChannelImage":2,"./ImagePlane":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCIvVXNlcnMvdGFrdXlhLWEvd29ya3NwYWNlL3dhaWZ1MngtanMvc3JjL0NoYW5uZWxJbWFnZS5qcyIsIi9Vc2Vycy90YWt1eWEtYS93b3Jrc3BhY2Uvd2FpZnUyeC1qcy9zcmMvSW1hZ2VQbGFuZS5qcyIsIi9Vc2Vycy90YWt1eWEtYS93b3Jrc3BhY2Uvd2FpZnUyeC1qcy9zcmMvV2FpZnUyeC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0lDakJxQixZQUFZO0FBQ2xCLGFBRE0sWUFBWSxDQUNqQixLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTs4QkFEbEIsWUFBWTs7QUFFekIsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlCQUFpQixDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQztBQUNwRCxZQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDaEIsbUJBQU87U0FDVjtBQUNELFlBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxLQUFLLEdBQUcsTUFBTSxFQUFFO0FBQ2pDLGtCQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDNUM7QUFDRCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQjs7aUJBWmdCLFlBQVk7O2VBNENoQix1QkFBQyxFQUFFLEVBQUU7QUFDZCxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxD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dGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9XYWlmdTJ4ID0gcmVxdWlyZShcIi4vV2FpZnUyeFwiKTtcblxudmFyIF9XYWlmdTJ4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1dhaWZ1MngpO1xuXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgIGlmIChcInByb2Nlc3NcIiBpbiBnbG9iYWwpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBfV2FpZnUyeDJbXCJkZWZhdWx0XCJdO1xuICAgIH1cbiAgICBnbG9iYWwuV2FpZnUyeCA9IF9XYWlmdTJ4MltcImRlZmF1bHRcIl07XG59KSgodW5kZWZpbmVkIHx8IDApLnNlbGYgfHwgZ2xvYmFsKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZV3QxZVdFdFlTOTNiM0pyYzNCaFkyVXZkMkZwWm5VeWVDMXFjeTl6Y21NdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdkVUpCUVc5Q0xGZEJRVmM3T3pzN1FVRkZMMElzUTBGQlF5eFZRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTmtMRkZCUVVrc1UwRkJVeXhKUVVGSkxFMUJRVTBzUlVGQlJUdEJRVU55UWl4alFVRk5MRU5CUVVNc1QwRkJUeXgxUWtGQlZTeERRVUZETzB0QlF6VkNPMEZCUTBRc1ZVRkJUU3hEUVVGRExFOUJRVThzZFVKQlFWVXNRMEZCUXp0RFFVTTFRaXhEUVVGQkxFTkJRVVVzUTBGQlF5eGhRVUZSTEVOQlFVTXNRMEZCUVN4RFFVRkZMRWxCUVVrc1NVRkJTU3hOUVVGTkxFTkJRVU1zUTBGQlF5SXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRmRoYVdaMU1uZ2dabkp2YlNBbkxpOVhZV2xtZFRKNEp6dGNibHh1S0daMWJtTjBhVzl1S0dkc2IySmhiQ2tnZTF4dUlDQWdJR2xtSUNoY0luQnliMk5sYzNOY0lpQnBiaUJuYkc5aVlXd3BJSHRjYmlBZ0lDQWdJQ0FnYlc5a2RXeGxMbVY0Y0c5eWRITWdQU0JYWVdsbWRUSjRPMXh1SUNBZ0lIMWNiaUFnSUNCbmJHOWlZV3d1VjJGcFpuVXllQ0E5SUZkaGFXWjFNbmc3WEc1OUtTZ29kR2hwY3lCOGZDQXdLUzV6Wld4bUlIeDhJR2RzYjJKaGJDazdYRzRpWFgwPSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWxJbWFnZSB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCwgYnVmZmVyKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0KTtcbiAgICAgICAgaWYgKGJ1ZmZlciA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggIT0gd2lkdGggKiBoZWlnaHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgYnVmZmVyIGxlbmd0aFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1ZmZlci5zZXQoYnVmZmVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY2hhbm5lbERlY29tcG9zZShpbWFnZSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBsZXQgaW1hZ2VSID0gbmV3IENoYW5uZWxJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgbGV0IGltYWdlRyA9IG5ldyBDaGFubmVsSW1hZ2Uod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGxldCBpbWFnZUIgPSBuZXcgQ2hhbm5lbEltYWdlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBsZXQgaW1hZ2VBID0gbmV3IENoYW5uZWxJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCB3aWR0aDsgdysrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBoID0gMDsgaCA8IGhlaWdodDsgaCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdyArIChoICogd2lkdGgpO1xuICAgICAgICAgICAgICAgIGltYWdlUi5idWZmZXJbaW5kZXhdID0gaW1hZ2VbKHcgKiA0KSArIChoICogd2lkdGggKiA0KV07XG4gICAgICAgICAgICAgICAgaW1hZ2VHLmJ1ZmZlcltpbmRleF0gPSBpbWFnZVsodyAqIDQpICsgKGggKiB3aWR0aCAqIDQpICsgMV07XG4gICAgICAgICAgICAgICAgaW1hZ2VCLmJ1ZmZlcltpbmRleF0gPSBpbWFnZVsodyAqIDQpICsgKGggKiB3aWR0aCAqIDQpICsgMl07XG4gICAgICAgICAgICAgICAgaW1hZ2VBLmJ1ZmZlcltpbmRleF0gPSBpbWFnZVsodyAqIDQpICsgKGggKiB3aWR0aCAqIDQpICsgM107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtpbWFnZVIsIGltYWdlRywgaW1hZ2VCLCBpbWFnZUFdO1xuICAgIH1cblxuICAgIHN0YXRpYyBjaGFubmVsQ29tcG9zZShpbWFnZVIsIGltYWdlRywgaW1hZ2VCLCBpbWFnZUEpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gaW1hZ2VSLndpZHRoO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gaW1hZ2VSLmhlaWdodDtcbiAgICAgICAgbGV0IGltYWdlID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGggKiBoZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgaW1hZ2VbaSAqIDRdID0gaW1hZ2VSLmJ1ZmZlcltpXTtcbiAgICAgICAgICAgIGltYWdlW2kgKiA0ICsgMV0gPSBpbWFnZUcuYnVmZmVyW2ldO1xuICAgICAgICAgICAgaW1hZ2VbaSAqIDQgKyAyXSA9IGltYWdlQi5idWZmZXJbaV07XG4gICAgICAgICAgICBpbWFnZVtpICogNCArIDNdID0gMjU1Oy8vaW1hZ2VBLmJ1ZmZlcltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1hZ2U7XG4gICAgfVxuXG4gICAgZXh0cmFwb2xhdGlvbihweCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV4dHJhcG9sYXRpbmcuLi5cIik7XG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgbGV0IHRvX2luZGV4ID0gZnVuY3Rpb24gKHcsIGgpIHtcbiAgICAgICAgICAgIHJldHVybiB3ICsgaCAqIHdpZHRoO1xuICAgICAgICB9O1xuICAgICAgICBsZXQgaW1hZ2VfZXggPSBuZXcgQ2hhbm5lbEltYWdlKHdpZHRoICsgKDIgKiBweCksIGhlaWdodCArICgyICogcHgpKTtcbiAgICAgICAgZm9yIChsZXQgaCA9IDA7IGggPCBoZWlnaHQgKyAocHggKiAyKTsgaCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHdpZHRoICsgKHB4ICogMik7IHcrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHcgKyBoICogKHdpZHRoICsgKHB4ICogMikpO1xuICAgICAgICAgICAgICAgIGlmICh3IDwgcHgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTGVmdCBvdXRlciBhcmVhXG4gICAgICAgICAgICAgICAgICAgIGlmIChoIDwgcHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlZnQgdXBwZXIgYXJlYVxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VfZXguYnVmZmVyW2luZGV4XSA9IHRoaXMuYnVmZmVyW3RvX2luZGV4KDAsIDApXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChweCArIGhlaWdodCA8PSBoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IGxvd2VyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX2V4LmJ1ZmZlcltpbmRleF0gPSB0aGlzLmJ1ZmZlclt0b19pbmRleCgwLCBoZWlnaHQgLSAxKV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IG91dGVyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX2V4LmJ1ZmZlcltpbmRleF0gPSB0aGlzLmJ1ZmZlclt0b19pbmRleCgwLCBoIC0gcHgpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHggKyB3aWR0aCA8PSB3KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJpZ2h0IG91dGVyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgaWYgKGggPCBweCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmlnaHQgdXBwZXIgYXJlYVxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VfZXguYnVmZmVyW2luZGV4XSA9IHRoaXMuYnVmZmVyW3RvX2luZGV4KHdpZHRoIC0gMSwgMCldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHB4ICsgaGVpZ2h0IDw9IGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJpZ2h0IGxvd2VyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX2V4LmJ1ZmZlcltpbmRleF0gPSB0aGlzLmJ1ZmZlclt0b19pbmRleCh3aWR0aCAtIDEsIGhlaWdodCAtIDEpXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJpZ2h0IG91dGVyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlX2V4LmJ1ZmZlcltpbmRleF0gPSB0aGlzLmJ1ZmZlclt0b19pbmRleCh3aWR0aCAtIDEsIGggLSBweCldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoIDwgcHgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBwZXIgb3V0ZXIgYXJlYVxuICAgICAgICAgICAgICAgICAgICBpbWFnZV9leC5idWZmZXJbaW5kZXhdID0gdGhpcy5idWZmZXJbdG9faW5kZXgodyAtIHB4LCAwKV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChweCArIGhlaWdodCA8PSBoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExvd2VyIG91dGVyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VfZXguYnVmZmVyW2luZGV4XSA9IHRoaXMuYnVmZmVyW3RvX2luZGV4KHcgLSBweCwgaGVpZ2h0IC0gMSldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElubmVyIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VfZXguYnVmZmVyW2luZGV4XSA9IHRoaXMuYnVmZmVyW3RvX2luZGV4KHcgLSBweCwgaCAtIHB4KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbWFnZV9leDtcbiAgICB9XG5cbiAgICByZXNpemUoc2NhbGUpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICBsZXQgc2NhbGVkX3dpZHRoID0gTWF0aC5yb3VuZCh3aWR0aCAqIHNjYWxlKTtcbiAgICAgICAgbGV0IHNjYWxlZF9oZWlnaHQgPSBNYXRoLnJvdW5kKGhlaWdodCAqIHNjYWxlKTtcbiAgICAgICAgbGV0IHNjYWxlZF9pbWFnZSA9IG5ldyBDaGFubmVsSW1hZ2Uoc2NhbGVkX3dpZHRoLCBzY2FsZWRfaGVpZ2h0KTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBzY2FsZWRfd2lkdGg7IHcrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaCA9IDA7IGggPCBzY2FsZWRfaGVpZ2h0OyBoKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2NhbGVkX2luZGV4ID0gdyArIChoICogc2NhbGVkX3dpZHRoKTtcbiAgICAgICAgICAgICAgICBsZXQgd19vcmlnaW5hbCA9IE1hdGgucm91bmQoKHcgKyAxKSAvIHNjYWxlKSAtIDE7XG4gICAgICAgICAgICAgICAgbGV0IGhfb3JpZ2luYWwgPSBNYXRoLnJvdW5kKChoICsgMSkgLyBzY2FsZSkgLSAxO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleF9vcmlnaW5hbCA9IHdfb3JpZ2luYWwgKyAoaF9vcmlnaW5hbCAqIHdpZHRoKTtcbiAgICAgICAgICAgICAgICBzY2FsZWRfaW1hZ2UuYnVmZmVyW3NjYWxlZF9pbmRleF0gPSB0aGlzLmJ1ZmZlcltpbmRleF9vcmlnaW5hbF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjYWxlZF9pbWFnZTtcbiAgICB9XG59XG4iLCJjb25zdCBCTE9DS19TSVpFID0gMTI4O1xuY29uc3QgT1ZFUkxBUCA9IDE0O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZVBsYW5lIHtcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0LCBidWZmZXIpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHdpZHRoICogaGVpZ2h0KTtcbiAgICAgICAgaWYgKGJ1ZmZlciA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggIT0gd2lkdGggKiBoZWlnaHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgYnVmZmVyIGxlbmd0aFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1ZmZlci5zZXQoYnVmZmVyKTtcbiAgICB9XG5cbiAgICBnZXRMZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0QnVmZmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXI7XG4gICAgfVxuXG4gICAgaW5kZXgodywgaCkge1xuICAgICAgICByZXR1cm4gdyArIGggKiB0aGlzLndpZHRoO1xuICAgIH1cblxuICAgIGdldFZhbHVlKHcsIGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuaW5kZXgodywgaCldO1xuICAgIH1cblxuICAgIHNldFZhbHVlKHcsIGgsIHYpIHtcbiAgICAgICAgdGhpcy5idWZmZXJbdGhpcy5pbmRleCh3LCBoKV0gPSB2O1xuICAgIH1cblxuICAgIGdldFZhbHVlSW5kZXhlZChpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlcltpXTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZUluZGV4ZWQoaSwgdikge1xuICAgICAgICB0aGlzLmJ1ZmZlcltpXSA9IHY7XG4gICAgfVxuXG4gICAgLy8gYmxvY2tzIG92ZXJsYXAgMTRweCBlYWNoIG90aGVyXG4gICAgc3RhdGljIGJsb2NraW5nKGluaXRpYWxQbGFuZXMpIHtcbiAgICAgICAgbGV0IHdpZHRoSW5wdXQgPSBpbml0aWFsUGxhbmVzWzBdLndpZHRoO1xuICAgICAgICBsZXQgaGVpZ2h0SW5wdXQgPSBpbml0aWFsUGxhbmVzWzBdLmhlaWdodDtcblxuICAgICAgICBsZXQgYmxvY2tzVyA9IE1hdGguY2VpbCgod2lkdGhJbnB1dCAtIE9WRVJMQVApIC8gKEJMT0NLX1NJWkUgLSBPVkVSTEFQKSk7XG4gICAgICAgIGxldCBibG9ja3NIID0gTWF0aC5jZWlsKChoZWlnaHRJbnB1dCAtIE9WRVJMQVApIC8gKEJMT0NLX1NJWkUgLSBPVkVSTEFQKSk7XG4gICAgICAgIGxldCBibG9ja3MgPSBibG9ja3NXICogYmxvY2tzSDtcblxuICAgICAgICBsZXQgaW5wdXRCbG9ja3MgPSBbXTsgLy8gWyBbIGJsb2NrMF9SLCBibG9jazBfRywgYmxvY2swX0IgXSwgWyBibG9jazFfUiwgLi4uXSAuLi4gXVxuICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IGJsb2NrczsgYisrKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tJbmRleFcgPSBiICUgYmxvY2tzVztcbiAgICAgICAgICAgIGxldCBibG9ja0luZGV4SCA9IE1hdGguZmxvb3IoYiAvIGJsb2Nrc1cpO1xuXG4gICAgICAgICAgICBsZXQgYmxvY2tXaWR0aDtcbiAgICAgICAgICAgIGxldCBibG9ja0hlaWdodDtcbiAgICAgICAgICAgIGlmIChibG9ja0luZGV4VyA9PSBibG9ja3NXIC0gMSkge1xuICAgICAgICAgICAgICAgIGJsb2NrV2lkdGggPSB3aWR0aElucHV0IC0gKChCTE9DS19TSVpFIC0gT1ZFUkxBUCkgKiBibG9ja0luZGV4Vyk7IC8vIHJpZ2h0IGVuZCBibG9ja1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBibG9ja1dpZHRoID0gQkxPQ0tfU0laRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChibG9ja0luZGV4SCA9PSBibG9ja3NIIC0gMSkge1xuICAgICAgICAgICAgICAgIGJsb2NrSGVpZ2h0ID0gaGVpZ2h0SW5wdXQgLSAoKEJMT0NLX1NJWkUgLSBPVkVSTEFQKSAqIGJsb2NrSW5kZXhIKTsgLy8gYm90dG9tIGVuZCBibG9ja1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBibG9ja0hlaWdodCA9IEJMT0NLX1NJWkU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjaGFubmVscyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBpbml0aWFsUGxhbmVzLmxlbmd0aDsgbiArKykge1xuICAgICAgICAgICAgICAgIGNoYW5uZWxzW25dID0gbmV3IEltYWdlUGxhbmUoYmxvY2tXaWR0aCwgYmxvY2tIZWlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IGJsb2NrV2lkdGg7IHcrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGggPSAwOyBoIDwgYmxvY2tIZWlnaHQ7IGgrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IGluaXRpYWxQbGFuZXMubGVuZ3RoOyBuICsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SW5kZXhXID0gYmxvY2tJbmRleFcgKiAoQkxPQ0tfU0laRSAtIE9WRVJMQVApICsgdztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXRJbmRleEggPSBibG9ja0luZGV4SCAqIChCTE9DS19TSVpFIC0gT1ZFUkxBUCkgKyBoO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYW5uZWwgPSBpbml0aWFsUGxhbmVzW25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYgPSBjaGFubmVsLmdldFZhbHVlKHRhcmdldEluZGV4VywgdGFyZ2V0SW5kZXhIKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJlbG93IGltcGxlbWVudGF0aW9uIGlzIHNsb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCB0YXJnZXRJbmRleCA9IHRhcmdldEluZGV4SCAqIHdpZHRoSW5wdXQgKyB0YXJnZXRJbmRleFc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdiA9IGNoYW5uZWwuZ2V0VmFsdWVJbmRleGVkKHRhcmdldEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWxzW25dLnNldFZhbHVlKHcsIGgsIHYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXRCbG9ja3NbYl0gPSBjaGFubmVscztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyBpbnB1dEJsb2NrcywgYmxvY2tzVywgYmxvY2tzSCBdO1xuICAgIH1cblxuICAgIC8vIFsgWyBibG9jazBfUiwgYmxvY2swX0csIGJsb2NrMF9CIF0sIFsgYmxvY2sxX1IsIC4uLl0gLi4uIF1cbiAgICBzdGF0aWMgZGVibG9ja2luZyhvdXRwdXRCbG9ja3MsIGJsb2Nrc1csIGJsb2Nrc0gpIHtcbiAgICAgICAgbGV0IGJsb2NrX3NpemUgPSBvdXRwdXRCbG9ja3NbMF1bMF0ud2lkdGg7XG4gICAgICAgIGxldCB3aWR0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYmxvY2tzVzsgYisrKSB7XG4gICAgICAgICAgICB3aWR0aCArPSBvdXRwdXRCbG9ja3NbYl1bMF0ud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhlaWdodCA9IDA7XG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYmxvY2tzVyAqIGJsb2Nrc0g7IGIgKz0gYmxvY2tzVykge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IG91dHB1dEJsb2Nrc1tiXVswXS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJyZXN1bHQgaW1hZ2Ugd2lkdGg6XCIgKyB3aWR0aCArIFwiIGhlaWdodDpcIiArIGhlaWdodCk7XG4gICAgICAgIGxldCBvdXRwdXRQbGFuZXMgPSBbXTsgLy8gWyBwbGFuZVIsIHBsYW5lRywgcGxhbmVCIF1cbiAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBvdXRwdXRCbG9ja3MubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICAgIGxldCBibG9jayA9IG91dHB1dEJsb2Nrc1tiXTtcbiAgICAgICAgICAgIGxldCBibG9ja0luZGV4VyA9IGIgJSBibG9ja3NXO1xuICAgICAgICAgICAgbGV0IGJsb2NrSW5kZXhIID0gTWF0aC5mbG9vcihiIC8gYmxvY2tzVyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgYmxvY2subGVuZ3RoOyBuICsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dFBsYW5lc1tuXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFBsYW5lc1tuXSA9IG5ldyBJbWFnZVBsYW5lKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgY2hhbm5lbEJsb2NrID0gYmxvY2tbbl07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBjaGFubmVsQmxvY2sud2lkdGg7IHcrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBoID0gMDsgaCA8IGNoYW5uZWxCbG9jay5oZWlnaHQ7IGgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldEluZGV4VyA9IGJsb2NrSW5kZXhXICogYmxvY2tfc2l6ZSArIHc7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SW5kZXhIID0gYmxvY2tJbmRleEggKiBibG9ja19zaXplICsgaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXRJbmRleCA9IHRhcmdldEluZGV4SCAqIHdpZHRoICsgdGFyZ2V0SW5kZXhXO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gY2hhbm5lbEJsb2NrLmdldFZhbHVlKHcsIGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0UGxhbmVzW25dLnNldFZhbHVlSW5kZXhlZCh0YXJnZXRJbmRleCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRQbGFuZXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IENoYW5uZWxJbWFnZSBmcm9tICcuL0NoYW5uZWxJbWFnZSc7XG5pbXBvcnQgSW1hZ2VQbGFuZSBmcm9tICcuL0ltYWdlUGxhbmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWlmdTJ4IHtcbiAgICBjb25zdHJ1Y3Rvcihqc29uKSB7XG4gICAgICAgIHRoaXMuc2NhbGUyeE1vZGVsID0ganNvbi5zY2FsZTJ4TW9kZWw7XG4gICAgICAgIHRoaXMubm9pc2VNb2RlbCA9IGpzb24ubm9pc2VNb2RlbDtcbiAgICAgICAgdGhpcy5zY2FsZSA9IGpzb24uc2NhbGU7XG4gICAgICAgIHRoaXMuaXNEZW5vaXNpbmcgPSBqc29uLmlzRGVub2lzaW5nO1xuICAgIH1cblxuICAgIHN0YXRpYyBub3JtYWxpemUoaW1hZ2UpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgIGxldCBoZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICAgIGxldCBpbWFnZVBsYW5lID0gbmV3IEltYWdlUGxhbmUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGlmIChpbWFnZVBsYW5lLmdldEJ1ZmZlcigpLmxlbmd0aCAhPSBpbWFnZS5idWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3NlcnRpb24gZXJyb3I6IGxlbmd0aFwiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlLmJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW1hZ2VQbGFuZS5zZXRWYWx1ZUluZGV4ZWQoaSwgaW1hZ2UuYnVmZmVyW2ldIC8gMjU1LjApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbWFnZVBsYW5lO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZW5vcm1hbGl6ZShpbWFnZVBsYW5lKSB7XG4gICAgICAgIGxldCBpbWFnZSA9IG5ldyBDaGFubmVsSW1hZ2UoaW1hZ2VQbGFuZS53aWR0aCwgaW1hZ2VQbGFuZS5oZWlnaHQpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VQbGFuZS5nZXRCdWZmZXIoKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW1hZ2UuYnVmZmVyW2ldID0gTWF0aC5yb3VuZChpbWFnZVBsYW5lLmdldFZhbHVlSW5kZXhlZChpKSAqIDI1NS4wKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1hZ2U7XG4gICAgfVxuXG4gICAgc3RhdGljIGNvbnZvbHV0aW9uKGlucHV0UGxhbmVzLCBXLCBuT3V0cHV0UGxhbmUsIGJpYXMpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gaW5wdXRQbGFuZXNbMF0ud2lkdGg7XG4gICAgICAgIGxldCBoZWlnaHQgPSBpbnB1dFBsYW5lc1swXS5oZWlnaHQ7XG4gICAgICAgIGxldCBvdXRwdXRQbGFuZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbyA9IDA7IG8gPCBuT3V0cHV0UGxhbmU7IG8rKykge1xuICAgICAgICAgICAgb3V0cHV0UGxhbmVzW29dID0gbmV3IEltYWdlUGxhbmUod2lkdGggLSAyLCBoZWlnaHQgLSAyKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3VtVmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheShuT3V0cHV0UGxhbmUpO1xuICAgICAgICBsZXQgYmlhc1ZhbHVlcyA9IG5ldyBGbG9hdDMyQXJyYXkobk91dHB1dFBsYW5lKTtcbiAgICAgICAgYmlhc1ZhbHVlcy5zZXQoYmlhcyk7XG4gICAgICAgIGZvciAobGV0IHcgPSAxOyB3IDwgd2lkdGggLSAxOyB3KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGggPSAxOyBoIDwgaGVpZ2h0IC0gMTsgaCsrKSB7XG4gICAgICAgICAgICAgICAgc3VtVmFsdWVzLnNldChiaWFzVmFsdWVzKTsgIC8vIGxlYWt5IFJlTFUgYmlhc1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRQbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkwMCA9IGlucHV0UGxhbmVzW2ldLmdldFZhbHVlKHcgLSAxLCBoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpMTAgPSBpbnB1dFBsYW5lc1tpXS5nZXRWYWx1ZSh3ICAgICwgaCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaTIwID0gaW5wdXRQbGFuZXNbaV0uZ2V0VmFsdWUodyArIDEsIGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkwMSA9IGlucHV0UGxhbmVzW2ldLmdldFZhbHVlKHcgLSAxLCBoICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpMTEgPSBpbnB1dFBsYW5lc1tpXS5nZXRWYWx1ZSh3ICAgICwgaCAgICApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaTIxID0gaW5wdXRQbGFuZXNbaV0uZ2V0VmFsdWUodyArIDEsIGggICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkwMiA9IGlucHV0UGxhbmVzW2ldLmdldFZhbHVlKHcgLSAxLCBoICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpMTIgPSBpbnB1dFBsYW5lc1tpXS5nZXRWYWx1ZSh3ICAgICwgaCArIDEpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaTIyID0gaW5wdXRQbGFuZXNbaV0uZ2V0VmFsdWUodyArIDEsIGggKyAxKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBvID0gMDsgbyA8IG5PdXRwdXRQbGFuZTsgbysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NlcnQgaW5wdXRQbGFuZXMubGVuZ3RoID09IHBhcmFtcy53ZWlnaHRbb10ubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd2VpZ2h0X2luZGV4ID0gKG8gKiBpbnB1dFBsYW5lcy5sZW5ndGggKiA5KSArIChpICogOSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBzdW1WYWx1ZXNbb107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSArPSBpMDAgKiBXW3dlaWdodF9pbmRleCsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IGkxMCAqIFdbd2VpZ2h0X2luZGV4KytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gaTIwICogV1t3ZWlnaHRfaW5kZXgrK107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSArPSBpMDEgKiBXW3dlaWdodF9pbmRleCsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IGkxMSAqIFdbd2VpZ2h0X2luZGV4KytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gaTIxICogV1t3ZWlnaHRfaW5kZXgrK107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSArPSBpMDIgKiBXW3dlaWdodF9pbmRleCsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IGkxMiAqIFdbd2VpZ2h0X2luZGV4KytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gaTIyICogV1t3ZWlnaHRfaW5kZXgrK107XG4gICAgICAgICAgICAgICAgICAgICAgICBzdW1WYWx1ZXNbb10gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBvID0gMDsgbyA8IG5PdXRwdXRQbGFuZTsgbysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2ID0gc3VtVmFsdWVzW29dO1xuICAgICAgICAgICAgICAgICAgICAvLyB2ICs9IGJpYXNbb107IC8vIGxlYWt5IFJlTFUgYmlhcyBpcyBhbHJlYWR5IGFkZGVkIGFib3ZlXG4gICAgICAgICAgICAgICAgICAgIGlmICh2IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiAqPSAwLjE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0UGxhbmVzW29dLnNldFZhbHVlKHcgLSAxLCBoIC0gMSwgdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRQbGFuZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHR5cGVXKG1vZGVsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6ZSB0eXBlZCBXIG1hdHJpeFwiKTtcbiAgICAgICAgbGV0IFcgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCBtb2RlbC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSB3ZWlnaHQgbWF0cml4XG4gICAgICAgICAgICBsZXQgbGF5ZXJXZWlnaHQgPSBtb2RlbFtsXS53ZWlnaHQ7XG4gICAgICAgICAgICBsZXQgYXJyYXlXID0gW107XG4gICAgICAgICAgICBsYXllcldlaWdodC5mb3JFYWNoKGZ1bmN0aW9uKHdlaWdodEZvck91dHB1dFBsYW5lKSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0Rm9yT3V0cHV0UGxhbmUuZm9yRWFjaChmdW5jdGlvbih3ZWlnaHRNYXRyaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0TWF0cml4LmZvckVhY2goZnVuY3Rpb24od2VpZ2h0VmVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRWZWN0b3IuZm9yRWFjaChmdW5jdGlvbih3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlXLnB1c2godyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCB3ID0gbmV3IEZsb2F0MzJBcnJheShhcnJheVcubGVuZ3RoKTtcbiAgICAgICAgICAgIHcuc2V0KGFycmF5Vyk7XG4gICAgICAgICAgICBXW2xdID0gdztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVztcbiAgICB9XG5cbiAgICBzdGF0aWMgY2FsY1JHQihpbWFnZVIsIGltYWdlRywgaW1hZ2VCLCBtb2RlbCwgc2NhbGUsIHByb2dyZXNzLCBwaGFzZSkge1xuICAgICAgICBsZXQgWyBwbGFuZVIsIHBsYW5lRywgcGxhbmVCIF0gPSBbaW1hZ2VSLCBpbWFnZUcsIGltYWdlQl0ubWFwKChpbWFnZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGltZ1Jlc2l6ZWQgPSBzY2FsZSA9PSAxID8gaW1hZ2UgOiBpbWFnZS5yZXNpemUoc2NhbGUpO1xuXG4gICAgICAgICAgICAvLyBleHRyYXBvbGF0aW9uIGZvciBsYXllciBjb3VudCAoZWFjaCBjb252b2x1dGlvbiByZW1vdmVzIG91dGVyIDEgcGl4ZWwgYm9yZGVyKVxuICAgICAgICAgICAgbGV0IGltZ0V4dHJhID0gaW1nUmVzaXplZC5leHRyYXBvbGF0aW9uKG1vZGVsLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIHJldHVybiBXYWlmdTJ4Lm5vcm1hbGl6ZShpbWdFeHRyYSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBpbnB1dFBsYW5lcyA9IFsgcGxhbmVSLCBwbGFuZUcsIHBsYW5lQiBdO1xuXG4gICAgICAgIC8vIGJsb2NraW5nXG4gICAgICAgIGxldCBbIGlucHV0QmxvY2tzLCBibG9ja3NXLCBibG9ja3NIIF0gPSBJbWFnZVBsYW5lLmJsb2NraW5nKGlucHV0UGxhbmVzKTtcbiAgICAgICAgaW5wdXRQbGFuZXMgPSBudWxsO1xuXG4gICAgICAgIC8vIGluaXQgV1xuICAgICAgICBsZXQgVyA9IFdhaWZ1MngudHlwZVcobW9kZWwpO1xuXG4gICAgICAgIGxldCBvdXRwdXRCbG9ja3MgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBpbnB1dEJsb2Nrcy5sZW5ndGg7IGIrKykge1xuICAgICAgICAgICAgbGV0IGlucHV0QmxvY2sgPSBpbnB1dEJsb2Nrc1tiXTtcbiAgICAgICAgICAgIGxldCBvdXRwdXRCbG9jayA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IG1vZGVsLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5PdXRwdXRQbGFuZSA9IG1vZGVsW2xdLm5PdXRwdXRQbGFuZTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnZvbHV0aW9uXG4gICAgICAgICAgICAgICAgb3V0cHV0QmxvY2sgPSBXYWlmdTJ4LmNvbnZvbHV0aW9uKGlucHV0QmxvY2ssIFdbbF0sIG5PdXRwdXRQbGFuZSwgbW9kZWxbbF1bXCJiaWFzXCJdKTtcbiAgICAgICAgICAgICAgICBpbnB1dEJsb2NrID0gb3V0cHV0QmxvY2s7IC8vIHByb3BhZ2F0ZSBvdXRwdXQgcGxhbmUgdG8gbmV4dCBsYXllciBpbnB1dFxuICAgICAgICAgICAgICAgIGlucHV0QmxvY2tzW2JdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dHB1dEJsb2Nrc1tiXSA9IG91dHB1dEJsb2NrO1xuICAgICAgICAgICAgbGV0IGRvbmVSYXRpbyA9IE1hdGgucm91bmQoKDEwMCAqIChiICsgMSkpIC8gaW5wdXRCbG9ja3MubGVuZ3RoKTtcbiAgICAgICAgICAgIHByb2dyZXNzKHBoYXNlLCBkb25lUmF0aW8sIGlucHV0QmxvY2tzLmxlbmd0aCwgYiArIDEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJiOlwiICsgYiArIFwiIGlzIGRvbmUuIFwiICsgTWF0aC5yb3VuZCgoMTAwICogKGIgKyAxKSkgLyBpbnB1dEJsb2Nrcy5sZW5ndGgpICsgXCIlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0QmxvY2tzID0gbnVsbDtcblxuICAgICAgICAvLyBkZS1ibG9ja2luZ1xuICAgICAgICBsZXQgb3V0cHV0UGxhbmVzID0gSW1hZ2VQbGFuZS5kZWJsb2NraW5nKG91dHB1dEJsb2NrcywgYmxvY2tzVywgYmxvY2tzSCk7XG4gICAgICAgIGlmIChvdXRwdXRQbGFuZXMubGVuZ3RoICE9IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk91dHB1dCBwbGFuZXMgbXVzdCBiZSAzOiBjb2xvciBjaGFubmVsIFIsIEcsIEIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgWyBpbWFnZVIsIGltYWdlRywgaW1hZ2VCIF0gPSBvdXRwdXRQbGFuZXMubWFwKChvdXRwdXRQbGFuZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFdhaWZ1MnguZGVub3JtYWxpemUob3V0cHV0UGxhbmUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gWyBpbWFnZVIsIGltYWdlRywgaW1hZ2VCIF07XG4gICAgfVxuXG4gICAgY2FsYyhpbWFnZSwgd2lkdGgsIGhlaWdodCwgZG9uZSwgcHJvZ3Jlc3MpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NhbGUyeE1vZGVsID09IG51bGwgJiYgdGhpcy5ub2lzZU1vZGVsID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIGRvbmUoaW1hZ2UsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVjb21wb3NlXG4gICAgICAgIHByb2dyZXNzKCdkZWNvbXBvc2UnKTtcbiAgICAgICAgbGV0IFsgaW1hZ2VSLCBpbWFnZUcsIGltYWdlQiwgaW1hZ2VBIF0gPSBDaGFubmVsSW1hZ2UuY2hhbm5lbERlY29tcG9zZShpbWFnZSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgLy8gZGUtbm9pc2luZ1xuICAgICAgICBpZiAodGhpcy5ub2lzZU1vZGVsICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVub2lzaW5nIGFsbCBibG9ja3NcIik7XG4gICAgICAgICAgICBbIGltYWdlUiwgaW1hZ2VHLCBpbWFnZUIgXSA9IFdhaWZ1MnguY2FsY1JHQihpbWFnZVIsIGltYWdlRywgaW1hZ2VCLCB0aGlzLm5vaXNlTW9kZWwsIDEsIHByb2dyZXNzLCAnZGVub2lzZScpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZW5vaXNlZCBhbGwgYmxvY2tzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlXG4gICAgICAgIGlmICh0aGlzLnNjYWxlMnhNb2RlbCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYWxpbmcgYWxsIGJsb2Nrc1wiKTtcbiAgICAgICAgICAgIFsgaW1hZ2VSLCBpbWFnZUcsIGltYWdlQiBdID0gV2FpZnUyeC5jYWxjUkdCKGltYWdlUiwgaW1hZ2VHLCBpbWFnZUIsIHRoaXMuc2NhbGUyeE1vZGVsLCB0aGlzLnNjYWxlLCBwcm9ncmVzcywgJ3NjYWxlJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYWxlZCBhbGwgYmxvY2tzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVzaXplIGFscGhhIGNoYW5uZWxcbiAgICAgICAgaW1hZ2VBID0gdGhpcy5zY2FsZSA9PSAxID8gaW1hZ2VBIDogaW1hZ2VBLnJlc2l6ZSh0aGlzLnNjYWxlKTtcblxuICAgICAgICBpZiAoaW1hZ2VBLmxlbmd0aCAhPSBpbWFnZVIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGNoYW5uZWwgaW1hZ2Ugc2l6ZSBtdXN0IGJlIHNhbWUgd2l0aCBSIGNoYW5uZWwgaW1hZ2Ugc2l6ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlY29tcG9zZVxuICAgICAgICBwcm9ncmVzcygncmVjb21wb3NlJyk7XG4gICAgICAgIGxldCBpbWFnZTJ4ID0gQ2hhbm5lbEltYWdlLmNoYW5uZWxDb21wb3NlKGltYWdlUiwgaW1hZ2VHLCBpbWFnZUIsIGltYWdlQSk7XG5cbiAgICAgICAgZG9uZShpbWFnZTJ4LCBpbWFnZVIud2lkdGgsIGltYWdlUi5oZWlnaHQpO1xuICAgIH1cbn1cbiJdfQ==
