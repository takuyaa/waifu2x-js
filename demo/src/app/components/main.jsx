require('whatwg-fetch');

let React = require('react');
let SettingControl = require('./setting-control.jsx');
let ImageViewer = require('./image-viewer.jsx');
let Icon = require('./icon.jsx');
let Progress = require('./progress.jsx');
let worker = null;

const ROOT = location.pathname;
const ANIME_NOISE_WEAK_MODEL_PATH = ROOT + 'models/anime_style_art_rgb/noise1_model.json';
const ANIME_NOISE_STRONG_MODEL_PATH = ROOT + 'models/anime_style_art_rgb/noise2_model.json';
const ANIME_SCALE_2X_MODEL_PATH = ROOT + 'models/anime_style_art_rgb/scale2.0x_model.json';
const PHOTO_SCALE_2X_MODEL_PATH = ROOT + 'models/ukbench/scale2.0x_model.json';

let Main = React.createClass({
    getInitialState() {
        return {
            imageSrc: null,
            imageWidth: 180,
            imageHeight: 120,
            isCalculating: false,
            isCalculated: false,
            isDisplayCalculated: false,
            calculatedImageSrc: null,
            calculatedImageWidth: null,
            calculatedImageHeight: null,
            filename: null,
            scale: 2,                          // Actual scaling ratio
            scaleNumber: 2,                    // 0 or 1 or 2
            scaleDescription: '2.0x',          // '1.0x' or '1.6x' or '2.0x'
            denoisingLevelNumber: 0,           // 0 or 1 or 2
            denoisingLevelDescription: 'none', // 'none' or 'weak' or 'strong'
            imageType: 'anime',                // 'anime' or 'photo'
            calculatingScaleDescription: '',
            calculatingDenoisingLevelDescription: '',
            calculatingImageType: '',
            scale2xModel: null,
            noiseModel: null,
            doneRatio: 0,
            progressMessage: ''
        };
    },
    updateScale(scaleNumber) {
        this.updateDenoisingLevel(this.state.denoisingLevelNumber);
        // Not allowed to execute with 1x && no denoising
        /*
        if (scaleNumber == 0) {
            this.updateDenoisingLevel(1);
        } else {
            this.updateDenoisingLevel(this.state.denoisingLevelNumber);
        }
        */
        this.setState({ scaleNumber: scaleNumber });
        if (scaleNumber == 0) {
            this.setState({ scale: 1,   scaleDescription: '1.0x' }, () => {
                document.getElementById("slider-1").MaterialSlider.change("0");  // workaround for Material Design Lite
            });
        } else if (scaleNumber == 1) {
            this.setState({ scale: 1.6, scaleDescription: '1.6x' }, () => {
                document.getElementById("slider-1").MaterialSlider.change("1");  // workaround for Material Design Lite
            });
        } else if (scaleNumber == 2) {
            this.setState({ scale: 2,   scaleDescription: '2.0x' }, () => {
                document.getElementById("slider-1").MaterialSlider.change("2");  // workaround for Material Design Lite
            });
        }
    },
    updateDenoisingLevel(denoisingLevelNumber) {
        this.setState({ denoisingLevelNumber: denoisingLevelNumber });
        if (denoisingLevelNumber == 0) {
            this.setState({ denoisingLevelDescription: 'none' }, () => {
                document.getElementById("slider-2").MaterialSlider.change("0");  // workaround for Material Design Lite
            });
        } else if (denoisingLevelNumber == 1) {
            this.setState({ denoisingLevelDescription: 'weak' }, () => {
                document.getElementById("slider-2").MaterialSlider.change("1");  // workaround for Material Design Lite
            });
        } else if (denoisingLevelNumber == 2) {
            this.setState({ denoisingLevelDescription: 'strong' }, () => {
                document.getElementById("slider-2").MaterialSlider.change("2");  // workaround for Material Design Lite
            });
        }
    },
    updateImageType(imageType) {
        this.setState({ imageType: imageType });

        // Reset to default parameters (2x && no denoising)
        this.updateScale(2);
        this.updateDenoisingLevel(0);

        // Not allowed to denoise in 'photo' (No models are published)
        if (imageType == 'anime') {
            document.getElementById("slider-2").MaterialSlider.enable();
        } else if (imageType == 'photo') {
            document.getElementById("slider-2").MaterialSlider.disable();
        }
    },
    updateFile(file) {
        // Workaround for Material Design Lite
        document.getElementById('progress').MaterialProgress.setProgress(0);

        // Stop worker if calculating
        if (worker != null) {
            console.log('Stop worker');
            worker.terminate();
        }
        this.setState({ isCalculating: false, isCalculated: false, isDisplayCalculated: false });

        let urlCreator = window.URL || window.webkitURL;
        let imageDataURL = urlCreator.createObjectURL(file);
        this.setState({ imageSrc: imageDataURL, filename: file.name }, () => {
            let imgNode = React.findDOMNode(this.refs.hiddenImage);
            imgNode.onload = () => {
                let canvasNode = React.findDOMNode(this.refs.hiddenCanvas);
                this.setState({ imageWidth: imgNode.naturalWidth, imageHeight: imgNode.naturalHeight }, () => {
                    let context = canvasNode.getContext("2d");
                    let image = new Image();
                    image.onload = () => {
                        context.clearRect(0, 0, canvasNode.width, canvasNode.height);
                        context.drawImage(image, 0, 0, canvasNode.width, canvasNode.height);
                    };
                    image.src = this.state.imageSrc;
                });
            };
            imgNode.src = this.state.imageSrc;
        });
    },
    handleStartClick() {
        // Workaround for Material Design Lite
        document.getElementById('progress').MaterialProgress.setProgress(0);

        if (this.state.imageSrc == null) {
            return;
        }

        this.setState({
            isCalculating: true,
            isCalculated: false,
            isDisplayCalculated: false,
            doneRatio: 0,
            doneBlocks: 0,
            allBlocks: 0,
            calculatingScaleDescription: this.state.scaleDescription,
            calculatingDenoisingLevelDescription: this.state.denoisingLevelDescription,
            calculatingImageType: this.state.imageType,
            progressMessage: 'Loading model files'
        });

        let loadModel = function(filepath, callback) {
            return new Promise(function(resolve, reject){
                fetch(filepath)
                    .then((response) => {
                        return response.json();
                    }).then((json) => {
                        console.log('Model file is loaded:' + filepath);
                        callback(json);
                        resolve();
                    }).catch((e) => {
                        reject(e);
                    });
            });
        };

        let noiseModelFilepath = null;
        let scaleModelFilepath = null;
        if (this.state.imageType == 'anime') {
            if (this.state.denoisingLevelNumber == 1) {
                noiseModelFilepath = ANIME_NOISE_WEAK_MODEL_PATH;
            } else if (this.state.denoisingLevelNumber == 2) {
                noiseModelFilepath = ANIME_NOISE_STRONG_MODEL_PATH;
            }
            if (0 < this.state.scaleNumber) {
                scaleModelFilepath = ANIME_SCALE_2X_MODEL_PATH;
            }
        } else if (this.state.imageType == 'photo') {
            if (0 < this.state.scaleNumber) {
                scaleModelFilepath = PHOTO_SCALE_2X_MODEL_PATH;
            }
        }

        let promises = [];
        if (noiseModelFilepath != null) {
            promises.push(loadModel(noiseModelFilepath, (json) => {
                this.setState({ noiseModel: json });
            }));
        } else {
            this.setState({ noiseModel: null });
        }
        if (scaleModelFilepath != null) {
            promises.push(loadModel(scaleModelFilepath, (json) => {
                this.setState({ scale2xModel: json });
            }));
        } else {
            this.setState({ scale2xModel: null });
        }

        Promise.all(promises)
            .then(() => {
                console.log('All model files are loaded');
                let canvasNode = React.findDOMNode(this.refs.hiddenCanvas);
                let context = canvasNode.getContext("2d");
                let imageData = context.getImageData(0, 0, this.state.imageWidth, this.state.imageHeight);

                // Stop worker if calculating
                if (worker != null) {
                    console.log('Stop worker');
                    worker.terminate();
                }

                worker = new Worker("js/worker.js");
                worker.onmessage = (e) => {
                    // result
                    if (e.data.command != 'progress') {
                        let image2x = e.data.image2x;
                        let width = e.data.width;
                        let height = e.data.height;

                        let calculatedCanvasNode = React.findDOMNode(this.refs.calculatedHiddenCanvas);
                        let calculatedContext = calculatedCanvasNode.getContext("2d");
                        let imageData2x = calculatedContext.createImageData(width, height);
                        imageData2x.data.set(image2x);
                        this.setState({ calculatedImageWidth: width, calculatedImageHeight: height}, () => {
                            calculatedContext.putImageData(imageData2x, 0, 0);
                            this.setState({
                                isCalculating: false,
                                isCalculated: true,
                                isDisplayCalculated: true,
                                calculatedImageSrc: calculatedCanvasNode.toDataURL()
                            });
                        });
                        return;
                    }

                    // progress
                    if (e.data.phase == 'scale' || e.data.phase == 'denoise') {
                        document.getElementById('progress').MaterialProgress.setProgress(Math.round(e.data.doneRatio));
                        let message = e.data.phase == 'scale' ? 'Scaling image : ' : 'Denoising image : ';
                        message += e.data.doneBlocks + ' / ' + e.data.allBlocks + ' blocks done';
                        this.setState({ doneRatio: e.data.doneRatio, progressMessage: message });
                        return;
                    }
                    if (e.data.phase == 'decompose') {
                        this.setState({ progressMessage: 'Decomposing image' });
                        return;
                    }
                    if (e.data.phase == 'recompose') {
                        this.setState({ progressMessage: 'Recomposing image' });
                        return;
                    }
                    console.log('Received an unknown message from worker');
                };
                worker.postMessage({
                    scale2xModel: this.state.scale2xModel,
                    noiseModel: this.state.noiseModel,
                    scale: this.state.scale,
                    imageData: imageData
                });
            }).catch((e) => {
                console.log(e, 'Failed to load model files');
                this.setState({ isCalculating: false, isCalculated: false, isDisplayCalculated: false });
            });
    },
    handleCancelClick() {
        this.setState({ isCalculating: false, isCalculated: false, isDisplayCalculated: false });
        if (worker == null) {
            return;
        }
        worker.terminate();
        worker = null;
    },
    handleCompareClick() {
        this.setState({ isDisplayCalculated: !this.state.isDisplayCalculated });
    },
    getStyle() {
        return {
            global: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: '13px',
                lineHeight: '20px',
                backgroundColor: '#f3f3f3',
                minHeight: '100%'
            },
            headerTitle: {
                paddingLeft: '40px'
            },
            title: {
                color: 'rgb(255, 255, 255)',
                fontFamily: 'RobotoDraft, Roboto, sans-serif',
                fontSize: '24px',
                fontWeight: 'normal',
                textDecoration: 'none',
                WebkitFontSmoothing: 'antialiased'
            },
            navigationLink: {
                color: 'rgba(255, 255, 255, 1)',
                textDecoration: 'none',
                fontSize: '14px'
            },
            content: {
                color: 'rgb(117, 117, 117)'
            },
            progressCard: {
                marginBottom: '16px',
                display: this.state.isCalculating ? '' : 'none'
            },
            imageViewerCard: {
                marginBottom: '16px',
                display: this.state.imageSrc ? '' : 'none'
            },
            hiddenImage: {
                display: 'none'
            },
            hiddenCanvas: {
                display: 'none'
            },
            calculatedHiddenCanvas: {
                display: 'none'
            }
        };
    },
    render: function () {
        let style = this.getStyle();
        return (
            <div style={style.global} className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header mdl-layout__header--scroll">
                    <div style={style.headerTitle} className="mdl-layout__header-row">
                        <a href="../" style={style.title}>
                            <span>waifu2x.js</span>
                        </a>
                        <div className="mdl-layout-spacer"></div>
                        <nav className="mdl-navigation">
                            <a href="https://github.com/takuyaa/waifu2x-js" style={style.navigationLink}>
                                <Icon iconType="link" /> GitHub
                            </a>
                        </nav>
                    </div>
                </header>
                <main className="mdl-layout__content" style={style.content}>
                    <div className="page-content">
                        <main className="mdl-grid">
                            <div className="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet">
                                <SettingControl filename={this.state.filename}
                                                scale={this.state.scale}
                                                scaleNumber={this.state.scaleNumber}
                                                onScaleChange={this.updateScale}
                                                scaleDescription={this.state.scaleDescription}
                                                denoisingLevelNumber={this.state.denoisingLevelNumber}
                                                onDenoisingLevelChange={this.updateDenoisingLevel}
                                                denoisingLevelDescription={this.state.denoisingLevelDescription}
                                                imageType={this.state.imageType}
                                                onImageTypeChange={this.updateImageType}
                                                onFileSelected={this.updateFile}
                                                handleStartClick={this.handleStartClick} />
                                <img ref="hiddenImage" style={style.hiddenImage} />
                                <canvas ref="hiddenCanvas" style={style.hiddenCanvas} width={this.state.imageWidth} height={this.state.imageHeight} />
                                <canvas ref="calculatedHiddenCanvas" style={style.calculatedHiddenCanvas} width={this.state.calculatedImageWidth} height={this.state.calculatedImageHeight} />
                            </div>
                            <div className="mdl-cell mdl-cell--8-col mdl-cell--12-col-tablet">
                                <div style={style.progressCard}>
                                    <Progress
                                        scale={this.state.scale}
                                        imageWidth={this.state.imageWidth}
                                        imageHeight={this.state.imageHeight}
                                        handleCancelClick={this.handleCancelClick}
                                        filename={this.state.filename}
                                        calculatingImageType={this.state.calculatingImageType}
                                        calculatingScaleDescription={this.state.calculatingScaleDescription}
                                        calculatingDenoisingLevelDescription={this.state.calculatingDenoisingLevelDescription}
                                        doneRatio={this.state.doneRatio}
                                        progressMessage={this.state.progressMessage} />
                                </div>
                                <div style={style.imageViewerCard}>
                                    <ImageViewer
                                        scale={this.state.scale}
                                        imageSrc={this.state.imageSrc}
                                        filename={this.state.filename}
                                        imageWidth={this.state.imageWidth}
                                        imageHeight={this.state.imageHeight}
                                        calculatedImageSrc={this.state.calculatedImageSrc}
                                        calculatedImageWidth={this.state.calculatedImageWidth}
                                        calculatedImageHeight={this.state.calculatedImageHeight}
                                        isCalculating={this.state.isCalculating}
                                        isCalculated={this.state.isCalculated}
                                        isDisplayCalculated={this.state.isDisplayCalculated}
                                        handleCompareClick={this.handleCompareClick} />
                                </div>
                            </div>
                        </main>
                    </div>
                </main>
            </div>
        );
    }
});

module.exports = Main;
