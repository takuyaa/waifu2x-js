let React = require('react');

let Icon = React.createClass({
    getStyle() {
        return {
            icons: {
                verticalAlign: 'middle'
            }
        }
    },
    render() {
        let style = this.getStyle();
        return (
            <i style={style.icons} className="material-icons">{this.props.iconType}</i>
        );
    }
});

module.exports = Icon;
