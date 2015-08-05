export default class ChannelImage {
    constructor(width, height, buffer) {
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

    static channelDecompose(image, width, height) {
        let imageR = new ChannelImage(width, height);
        let imageG = new ChannelImage(width, height);
        let imageB = new ChannelImage(width, height);
        let imageA = new ChannelImage(width, height);
        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                let index = w + (h * width);
                imageR.buffer[index] = image[(w * 4) + (h * width * 4)];
                imageG.buffer[index] = image[(w * 4) + (h * width * 4) + 1];
                imageB.buffer[index] = image[(w * 4) + (h * width * 4) + 2];
                imageA.buffer[index] = image[(w * 4) + (h * width * 4) + 3];
            }
        }
        return [imageR, imageG, imageB, imageA];
    }

    static channelCompose(imageR, imageG, imageB, imageA) {
        let width = imageR.width;
        let height = imageR.height;
        let image = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < width * height; i++) {
            image[i * 4] = imageR.buffer[i];
            image[i * 4 + 1] = imageG.buffer[i];
            image[i * 4 + 2] = imageB.buffer[i];
            image[i * 4 + 3] = 255;//imageA.buffer[i];
        }
        return image;
    }

    extrapolation(px) {
        console.log("Extrapolating...");
        let width = this.width;
        let height = this.height;
        let to_index = function (w, h) {
            return w + h * width;
        };
        let image_ex = new ChannelImage(width + (2 * px), height + (2 * px));
        for (let h = 0; h < height + (px * 2); h++) {
            for (let w = 0; w < width + (px * 2); w++) {
                let index = w + h * (width + (px * 2));
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

    resize(scale) {
        let width = this.width;
        let height = this.height;
        let scaled_width = Math.round(width * scale);
        let scaled_height = Math.round(height * scale);
        let scaled_image = new ChannelImage(scaled_width, scaled_height);
        for (let w = 0; w < scaled_width; w++) {
            for (let h = 0; h < scaled_height; h++) {
                let scaled_index = w + (h * scaled_width);
                let w_original = Math.round((w + 1) / scale) - 1;
                let h_original = Math.round((h + 1) / scale) - 1;
                let index_original = w_original + (h_original * width);
                scaled_image.buffer[scaled_index] = this.buffer[index_original];
            }
        }
        return scaled_image;
    }
}
