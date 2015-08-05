let React = require('react');

let CardComponentName = React.createClass({
    getStyle() {
        return {
            cardComponentName: {
                fontSize: '14px',
                color: 'rgb(117, 117, 117)',
                paddingBottom: '8px'
            }
        };
    },
    render() {
        let style = this.getStyle();
        return (
            <div style={style.cardComponentName}>{this.props.name}</div>
        );
    }
});

module.exports = CardComponentName;
