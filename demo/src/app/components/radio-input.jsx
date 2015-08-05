let React = require('react');

let RadioInput = React.createClass({
    _onChange() {
        // this.props.onChange(document.getElementById(this.props.id).value);
        this.props.onChange(React.findDOMNode(this.refs[this.props.id]).value);
    },
    getStyle() {
        return {
            controlInput: {
                color: 'rgb(33, 33, 33)',
                display: 'block',
                fontFamily: 'RobotoDraft, Roboto, sans-serif',
                paddingBottom: '10px'
            }
        };
    },
    render() {
        let style = this.getStyle();
        return (
            <label htmlFor={this.props.id} style={style.controlInput}
                   className="mdl-radio mdl-js-radio mdl-js-ripple-effect">
                <input ref={this.props.id}
                       id={this.props.id}
                       value={this.props.value}
                       onChange={this._onChange}
                       checked={this.props.checked == this.props.value}
                       type="radio"name="options" className="mdl-radio__button" />
                <span className="mdl-radio__label">
                    {this.props.label}
                </span>
            </label>
        );
    }
});

module.exports = RadioInput;
