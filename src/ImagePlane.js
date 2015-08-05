const BLOCK_SIZE = 128;
const OVERLAP = 14;

export default class ImagePlane {
    constructor(width, height, buffer) {
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

    getLength() {
        return this.buffer.length;
    }

    getBuffer() {
        return this.buffer;
    }

    index(w, h) {
        return w + h * this.width;
    }

    getValue(w, h) {
        return this.buffer[this.index(w, h)];
    }

    setValue(w, h, v) {
        this.buffer[this.index(w, h)] = v;
    }

    getValueIndexed(i) {
        return this.buffer[i];
    }

    setValueIndexed(i, v) {
        this.buffer[i] = v;
    }

    // blocks overlap 14px each other
    static blocking(initialPlanes) {
        let widthInput = initialPlanes[0].width;
        let heightInput = initialPlanes[0].height;

        let blocksW = Math.ceil((widthInput - OVERLAP) / (BLOCK_SIZE - OVERLAP));
        let blocksH = Math.ceil((heightInput - OVERLAP) / (BLOCK_SIZE - OVERLAP));
        let blocks = blocksW * blocksH;

        let inputBlocks = []; // [ [ block0_R, block0_G, block0_B ], [ block1_R, ...] ... ]
        for (let b = 0; b < blocks; b++) {
            let blockIndexW = b % blocksW;
            let blockIndexH = Math.floor(b / blocksW);

            let blockWidth;
            let blockHeight;
            if (blockIndexW == blocksW - 1) {
                blockWidth = widthInput - ((BLOCK_SIZE - OVERLAP) * blockIndexW); // right end block
            } else {
                blockWidth = BLOCK_SIZE;
            }
            if (blockIndexH == blocksH - 1) {
                blockHeight = heightInput - ((BLOCK_SIZE - OVERLAP) * blockIndexH); // bottom end block
            } else {
                blockHeight = BLOCK_SIZE;
            }

            let channels = [];
            for (let n = 0; n < initialPlanes.length; n ++) {
                channels[n] = new ImagePlane(blockWidth, blockHeight);
            }

            for (let w = 0; w < blockWidth; w++) {
                for (let h = 0; h < blockHeight; h++) {
                    for (let n = 0; n < initialPlanes.length; n ++) {
                        let targetIndexW = blockIndexW * (BLOCK_SIZE - OVERLAP) + w;
                        let targetIndexH = blockIndexH * (BLOCK_SIZE - OVERLAP) + h;
                        let channel = initialPlanes[n];
                        let v = channel.getValue(targetIndexW, targetIndexH);
                        // Below implementation is slow
                        // let targetIndex = targetIndexH * widthInput + targetIndexW;
                        // let v = channel.getValueIndexed(targetIndex);
                        channels[n].setValue(w, h, v);
                    }
                }
            }
            inputBlocks[b] = channels;
        }
        return [ inputBlocks, blocksW, blocksH ];
    }

    // [ [ block0_R, block0_G, block0_B ], [ block1_R, ...] ... ]
    static deblocking(outputBlocks, blocksW, blocksH) {
        let block_size = outputBlocks[0][0].width;
        let width = 0;
        for (let b = 0; b < blocksW; b++) {
            width += outputBlocks[b][0].width;
        }
        let height = 0;
        for (let b = 0; b < blocksW * blocksH; b += blocksW) {
            height += outputBlocks[b][0].height;
        }
        console.log("result image width:" + width + " height:" + height);
        let outputPlanes = []; // [ planeR, planeG, planeB ]
        for (let b = 0; b < outputBlocks.length; b++) {
            let block = outputBlocks[b];
            let blockIndexW = b % blocksW;
            let blockIndexH = Math.floor(b / blocksW);

            for (let n = 0; n < block.length; n ++) {
                if (outputPlanes[n] == null) {
                    outputPlanes[n] = new ImagePlane(width, height);
                }
                let channelBlock = block[n];
                for (let w = 0; w < channelBlock.width; w++) {
                    for (let h = 0; h < channelBlock.height; h++) {
                        let targetIndexW = blockIndexW * block_size + w;
                        let targetIndexH = blockIndexH * block_size + h;
                        let targetIndex = targetIndexH * width + targetIndexW;
                        let value = channelBlock.getValue(w, h);
                        outputPlanes[n].setValueIndexed(targetIndex, value);
                    }
                }
            }
        }
        return outputPlanes;
    }
}
