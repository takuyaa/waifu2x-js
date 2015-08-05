import ChannelImage from './ChannelImage';
import ImagePlane from './ImagePlane';

export default class Waifu2x {
    constructor(json) {
        this.scale2xModel = json.scale2xModel;
        this.noiseModel = json.noiseModel;
        this.scale = json.scale;
        this.isDenoising = json.isDenoising;
    }

    static normalize(image) {
        let width = image.width;
        let height = image.height;
        let imagePlane = new ImagePlane(width, height);
        if (imagePlane.getBuffer().length != image.buffer.length) {
            throw new Error("Assertion error: length");
        }
        for (let i = 0; i < image.buffer.length; i++) {
            imagePlane.setValueIndexed(i, image.buffer[i] / 255.0);
        }
        return imagePlane;
    }

    static denormalize(imagePlane) {
        let image = new ChannelImage(imagePlane.width, imagePlane.height);

        for (let i = 0; i < imagePlane.getBuffer().length; i++) {
            image.buffer[i] = Math.round(imagePlane.getValueIndexed(i) * 255.0);
        }
        return image;
    }

    static convolution(inputPlanes, W, nOutputPlane, bias) {
        let width = inputPlanes[0].width;
        let height = inputPlanes[0].height;
        let outputPlanes = [];
        for (let o = 0; o < nOutputPlane; o++) {
            outputPlanes[o] = new ImagePlane(width - 2, height - 2);
        }
        let sumValues = new Float32Array(nOutputPlane);
        let biasValues = new Float32Array(nOutputPlane);
        biasValues.set(bias);
        for (let w = 1; w < width - 1; w++) {
            for (let h = 1; h < height - 1; h++) {
                sumValues.set(biasValues);  // leaky ReLU bias
                for (let i = 0; i < inputPlanes.length; i++) {
                    let i00 = inputPlanes[i].getValue(w - 1, h - 1);
                    let i10 = inputPlanes[i].getValue(w    , h - 1);
                    let i20 = inputPlanes[i].getValue(w + 1, h - 1);
                    let i01 = inputPlanes[i].getValue(w - 1, h    );
                    let i11 = inputPlanes[i].getValue(w    , h    );
                    let i21 = inputPlanes[i].getValue(w + 1, h    );
                    let i02 = inputPlanes[i].getValue(w - 1, h + 1);
                    let i12 = inputPlanes[i].getValue(w    , h + 1);
                    let i22 = inputPlanes[i].getValue(w + 1, h + 1);

                    for (let o = 0; o < nOutputPlane; o++) {
                        // assert inputPlanes.length == params.weight[o].length
                        let weight_index = (o * inputPlanes.length * 9) + (i * 9);
                        let value = sumValues[o];
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
                for (let o = 0; o < nOutputPlane; o++) {
                    let v = sumValues[o];
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

    static typeW(model) {
        console.log("Initialize typed W matrix");
        let W = [];
        for (let l = 0; l < model.length; l++) {
            // initialize weight matrix
            let layerWeight = model[l].weight;
            let arrayW = [];
            layerWeight.forEach(function(weightForOutputPlane) {
                weightForOutputPlane.forEach(function(weightMatrix) {
                    weightMatrix.forEach(function(weightVector) {
                        weightVector.forEach(function(w) {
                            arrayW.push(w);
                        });
                    });
                });
            });
            let w = new Float32Array(arrayW.length);
            w.set(arrayW);
            W[l] = w;
        }
        return W;
    }

    static calcRGB(imageR, imageG, imageB, model, scale, progress, phase) {
        let [ planeR, planeG, planeB ] = [imageR, imageG, imageB].map((image) => {
            let imgResized = scale == 1 ? image : image.resize(scale);

            // extrapolation for layer count (each convolution removes outer 1 pixel border)
            let imgExtra = imgResized.extrapolation(model.length);

            return Waifu2x.normalize(imgExtra);
        });

        let inputPlanes = [ planeR, planeG, planeB ];

        // blocking
        let [ inputBlocks, blocksW, blocksH ] = ImagePlane.blocking(inputPlanes);
        inputPlanes = null;

        // init W
        let W = Waifu2x.typeW(model);

        let outputBlocks = [];
        for (let b = 0; b < inputBlocks.length; b++) {
            let inputBlock = inputBlocks[b];
            let outputBlock = null;
            for (let l = 0; l < model.length; l++) {
                let nOutputPlane = model[l].nOutputPlane;

                // convolution
                outputBlock = Waifu2x.convolution(inputBlock, W[l], nOutputPlane, model[l]["bias"]);
                inputBlock = outputBlock; // propagate output plane to next layer input
                inputBlocks[b] = null;
            }
            outputBlocks[b] = outputBlock;
            let doneRatio = Math.round((100 * (b + 1)) / inputBlocks.length);
            progress(phase, doneRatio, inputBlocks.length, b + 1);
            console.log("b:" + b + " is done. " + Math.round((100 * (b + 1)) / inputBlocks.length) + "%");
        }
        inputBlocks = null;

        // de-blocking
        let outputPlanes = ImagePlane.deblocking(outputBlocks, blocksW, blocksH);
        if (outputPlanes.length != 3) {
            throw new Error("Output planes must be 3: color channel R, G, B.");
        }

        [ imageR, imageG, imageB ] = outputPlanes.map((outputPlane) => {
            return Waifu2x.denormalize(outputPlane);
        });

        return [ imageR, imageG, imageB ];
    }

    calc(image, width, height, done, progress) {
        if (this.scale2xModel == null && this.noiseModel == null) {
            // do nothing
            done(image, width, height);
        }

        // decompose
        progress('decompose');
        let [ imageR, imageG, imageB, imageA ] = ChannelImage.channelDecompose(image, width, height);

        // de-noising
        if (this.noiseModel != null) {
            console.log("Denoising all blocks");
            [ imageR, imageG, imageB ] = Waifu2x.calcRGB(imageR, imageG, imageB, this.noiseModel, 1, progress, 'denoise');
            console.log("Denoised all blocks");
        }

        // calculate
        if (this.scale2xModel != null) {
            console.log("Scaling all blocks");
            [ imageR, imageG, imageB ] = Waifu2x.calcRGB(imageR, imageG, imageB, this.scale2xModel, this.scale, progress, 'scale');
            console.log("Scaled all blocks");
        }

        // resize alpha channel
        imageA = this.scale == 1 ? imageA : imageA.resize(this.scale);

        if (imageA.length != imageR.length) {
            throw new Error("A channel image size must be same with R channel image size");
        }

        // recompose
        progress('recompose');
        let image2x = ChannelImage.channelCompose(imageR, imageG, imageB, imageA);

        done(image2x, imageR.width, imageR.height);
    }
}
