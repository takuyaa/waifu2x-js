let React = require('react');
let Slider = require('./slider.jsx');
let RadioInput = require('./radio-input.jsx');
let CardTitle = require('./card-title.jsx');
let CardComponentName = require('./card-component-name.jsx');
let CardComponentDescription = require('./card-component-description.jsx');

let SettingControl = React.createClass({
    getInitialState() {
        return {
            imageSrc: null,
            imageWidth: 0,
            imageHeight: 0
        }
    },
    _clickFileSelectButton() {
        // Emit click event to hidden input element
        document.getElementById('file-selector').click();
    },
    _onFileSelected(e) {
        let file = e.target.files[0];
        if (file == null) {
            return;
        }
        this.props.onFileSelected(e.target.files[0]);
    },
    getStyle() {
        return {
            card: {
                width: '100%'
            },
            cardComponent: {
                paddingBottom: '20px',
                paddingLeft: '24px',
                paddingRight: '24px'
            },
            cardActionButton: {
                display: 'block',
                width: '78px',
                marginLeft: 'auto'
                // color: '#F44336'
            },
            cardButton: {
                color: 'rgb(117, 117, 117)',
                backgroundColor: '#ffffff',
                marginBottom: '12px'
            },
            cardComponentDescription: {
                color: 'rgb(33, 33, 33)',
                fontFamily: 'RobotoDraft, Roboto, sans-serif',
                fontSize: '16px',
                marginBottom: '8px'
            }
        };
    },
    render() {
        let style = this.getStyle();
        return (
            <div style={style.card} className="mdl-card mdl-shadow--2dp">
                <div className="mdl-card--expand">

                    <CardTitle title="Convert Settings" />
                    <div style={style.cardComponent}>
                        <CardComponentName name="Image file" />
                        <button style={style.cardButton}
                                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                                onClick={this._clickFileSelectButton}>
                            <input id="file-selector" type="file" style={{display:'none'}} onChange={this._onFileSelected} />
                            <div>Choose an image</div>
                        </button>
                        <div style={style.cardComponentDescription}>
                            {
                                this.props.filename ?
                                    this.props.filename :
                                    'Image file is not selected'
                            }
                        </div>
                    </div>

                    <div style={style.cardComponent}>
                        <CardComponentName name="Image type" />
                        <RadioInput id="option-1" label="Anime" value="anime" onChange={this.props.onImageTypeChange} checked={this.props.imageType} />
                        <RadioInput id="option-2" label="Photo" value="photo" onChange={this.props.onImageTypeChange} checked={this.props.imageType} />
                    </div>

                    <div style={style.cardComponent}>
                        <CardComponentName name="Scaling ratio" />
                        <CardComponentDescription description={this.props.scaleDescription} />
                        {
                            this.props.imageType == 'photo' ?
                                <Slider id="slider-1" min="1" max="2" step="1" value={this.props.scaleNumber} onChange={this.props.onScaleChange} /> :
                                <Slider id="slider-1" min="0" max="2" step="1" value={this.props.scaleNumber} onChange={this.props.onScaleChange} />
                        }
                    </div>

                    <div style={style.cardComponent}>
                        <CardComponentName name="Denoising level" />
                        <CardComponentDescription description={this.props.denoisingLevelDescription} />
                        <Slider id="slider-2" min="0" max="2" step="1" value={this.props.denoisingLevelNumber} onChange={this.props.onDenoisingLevelChange} />
                        {
                            /*
                            this.props.scaleNumber == 0 ?
                                <Slider id="slider-2" min="1" max="2" step="1" value={this.props.denoisingLevelNumber} onChange={this.props.onDenoisingLevelChange} /> :
                                <Slider id="slider-2" min="0" max="2" step="1" value={this.props.denoisingLevelNumber} onChange={this.props.onDenoisingLevelChange} />
                             */
                        }
                    </div>
                </div>

                <div className="mdl-card__actions mdl-card--border">
                    <button style={style.cardActionButton} onClick={this.props.handleStartClick} className="mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect">Start</button>
                </div>
            </div>
        );
    }
});

module.exports = SettingControl;
