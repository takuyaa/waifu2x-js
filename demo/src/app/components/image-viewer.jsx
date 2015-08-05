let React = require('react');
let Icon = require('./icon.jsx');

let ImageViewer = React.createClass({
    getStyle() {
        return {
            imageViewerContainer: {
                minWidth: '320px',
                maxWidth: '100%',
                minHeight: '80px',
                // width: this.props.isCalculated ? this.props.calculatedImageWidth : Math.round(this.props.imageWidth * this.props.scale),
                width: this.props.isCalculated ? this.props.calculatedImageWidth : this.props.imageWidth,
                overflow: 'visible'
            },
            image: {
                opacity: this.props.isCalculating ? 0.55 : 1,
                maxWidth: '100%',
                margin: '0 auto',
                // width: this.props.isCalculated ? this.props.calculatedImageWidth : Math.round(this.props.imageWidth * this.props.scale)
                width: this.props.isCalculated ? this.props.calculatedImageWidth : this.props.imageWidth
            },
            calculatedImage: {
                maxWidth: '100%',
                margin: '0 auto',
                width: this.props.calculatedImageWidth
            },
            supportingTextArea: {
                fontSize: '13px',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '24px',
                paddingRight: '24px',
                display: 'table'
            },
            supportingText: {
                display: 'table-row'
            },
            supportingTextTitle: {
                display: 'table-cell',
                paddingRight: '6px',
                textAlign: 'right'
            },
            supportingTextDescription: {
                display: 'table-cell',
                paddingLeft: '6px'
            },
            action: {
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '8px',
                fontSize: '16px',
                display: this.props.isCalculated ? '' : 'none'
            },
            progressContainer: {
                display: 'table-cell',
                textAlign: 'center',
                verticalAlign: 'middle'
            },
            progressBar: {
                width: '100%'
            }
        };
    },
    render() {
        let style = this.getStyle();

        let scaledSizeSupportingText =
            <div style={style.supportingText}>
                <div style={style.supportingTextTitle}>
                    Scaled size
                </div>
                <div style={style.supportingTextDescription}>
                    {this.props.calculatedImageWidth} x {this.props.calculatedImageHeight}
                </div>
            </div>;

        return (
            <div style={style.imageViewerContainer} className="mdl-card mdl-shadow--2dp">
                {
                    this.props.isCalculated && this.props.isDisplayCalculated ?
                        <img style={style.calculatedImage} src={this.props.calculatedImageSrc}/> :
                        <img style={style.image} src={this.props.imageSrc}/>
                }
                <div style={style.supportingTextArea}>
                    <div style={style.supportingText}>
                        <div style={style.supportingTextTitle}>
                            Original file
                        </div>
                        <div style={style.supportingTextDescription}>
                            {this.props.filename}
                        </div>
                    </div>
                    <div style={style.supportingText}>
                        <div style={style.supportingTextTitle}>
                            Original size
                        </div>
                        <div style={style.supportingTextDescription}>
                            {this.props.imageWidth} x {this.props.imageHeight}
                        </div>
                    </div>
                    {
                        this.props.isCalculated ?
                            scaledSizeSupportingText :
                            null
                    }
                    <div style={style.supportingText}>
                        <div style={style.supportingTextTitle}>
                            Displaying image
                        </div>
                        <div style={style.supportingTextDescription}>
                            {
                                this.props.isCalculated && this.props.isDisplayCalculated ?
                                    'After processing' :
                                    'Before processing'
                            }
                        </div>
                    </div>
                </div>
                <div style={style.action}>
                    <a id="compare-link" onClick={this.props.handleCompareClick}
                       className="mdl-button mdl-js-button mdl-js-ripple-effect">
                        <Icon iconType="cached"/> Compare
                    </a>
                    {
                        // 'onclick' events are never fired
                        // <div className="mdl-tooltip" htmlFor="compare-link">Compare processed image with original image</div>
                    }
                    <a id="download-link" href={this.props.calculatedImageSrc} download="waifu2x.png" target="_blank"
                       className="mdl-button mdl-js-button mdl-js-ripple-effect">
                        <Icon iconType="file_download"/> Download
                    </a>
                    <div className="mdl-tooltip" htmlFor="download-link">Download a processed image file</div>
                </div>
            </div>
        );
    }
});

module.exports = ImageViewer;
