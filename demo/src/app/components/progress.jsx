let React = require('react');
let CardTitle = require('./card-title.jsx');
let CardComponentDescription = require('./card-component-description.jsx');

let Progress = React.createClass({
    getStyle() {
        return {
            progressCard: {
                minWidth: '320px',
                maxWidth: '100%',
                // width: this.props.imageWidth * this.props.scale
                width: this.props.imageWidth
            },
            progressContainer: {
                width: '80%',
                margin: '0 auto',
                display: 'table'
            },
            progressBarArea: {
                width: '70%',
                display: 'table-cell',
                verticalAlign: 'middle'
            },
            progressBar: {
                width: '100%',
                height: '4px'
            },
            progressNumberArea: {
                textAlign: 'center',
                display: 'table-cell',
                verticalAlign: 'middle'
            },
            progressNumber: {
                color: 'rgb(33, 33, 33)',
                fontFamily: 'RobotoDraft, Roboto, sans-serif',
                fontSize: '18px'
            },
            progressDescription: {
                fontSize: '13px',
                display: 'table'
            },
            calculationSetting: {
                display: 'table-row'
            },
            calculationSettingTitle: {
                display: 'table-cell',
                textAlign: 'right',
                paddingRight: '6px'
            },
            calculationSettingDescription: {
                display: 'table-cell',
                paddingLeft: '6px'
            },
            cardComponent: {
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '24px',
                paddingRight: '24px'
            },
            cardComponentDescription: {
                borderTop: '1px solid rgba(0,0,0,.1)'
            },
            cardActionButton: {
                display: 'block',
                width: '80px',
                marginLeft: 'auto'
            }
        };
    },
    render() {
        let style = this.getStyle();
        return (
            <div style={style.progressCard} className="mdl-card mdl-shadow--2dp">
                <div className="mdl-card--expand">
                    <CardTitle title="Progress"/>

                    <div style={style.cardComponent}>
                        <ul style={style.progressContainer}>
                            <li style={style.progressBarArea}>
                                <span id="progress" ref="progress" style={style.progressBar}
                                      className="mdl-progress mdl-js-progress"></span>
                            </li>
                            <li style={style.progressNumberArea}>
                                <span style={style.progressNumber}>{this.props.doneRatio}%</span>
                            </li>
                        </ul>
                    </div>
                    <div style={style.cardComponent}>
                        <div style={style.progressDescription}>{this.props.progressMessage}</div>
                    </div>
                    <div style={style.cardComponentDescription}>
                        <div style={style.cardComponent}>
                            <div style={style.progressDescription}>
                                <div style={style.calculationSetting}>
                                    <div style={style.calculationSettingTitle}>
                                        Image type
                                    </div>
                                    <div style={style.calculationSettingDescription}>
                                        {this.props.calculatingImageType}
                                    </div>
                                </div>
                                <div style={style.calculationSetting}>
                                    <div style={style.calculationSettingTitle}>
                                        Scaling ratio
                                    </div>
                                    <div style={style.calculationSettingDescription}>
                                        {this.props.calculatingScaleDescription}
                                    </div>
                                </div>
                                <div style={style.calculationSetting}>
                                    <div style={style.calculationSettingTitle}>
                                        Denoising level
                                    </div>
                                    <div style={style.calculationSettingDescription}>
                                        {this.props.calculatingDenoisingLevelDescription}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mdl-card__actions mdl-card--border">
                    <button style={style.cardActionButton} onClick={this.props.handleCancelClick} className="mdl-button mdl-js-button mdl-js-ripple-effect">Cancel</button>
                </div>
            </div>
        );
    }
});

module.exports = Progress;
