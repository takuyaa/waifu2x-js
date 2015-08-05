let React = require('react');

let Slider = React.createClass({
    _onChange() {
        this.props.onChange(document.getElementById(this.props.id).value);
    },
    getStyle() {
        return {
            controlSlider: {
                cursor: 'pointer'
            }
        };
    },
    render() {
        let style = this.getStyle();
        return (
            <input style={style.controlSlider}
                   className="mdl-slider mdl-js-slider" type="range"
                   id={this.props.id} min={this.props.min} max={this.props.max} step={this.props.step}
                   value={this.props.value}
                   onChange={this._onChange} />
        );
    }
});

module.exports = Slider;
