let React = require('react');

let CardTitle = React.createClass({
    getStyle() {
        return {
            cardTitle: {
                fontFamily: 'RobotoDraft, Roboto, sans-serif',
                fontSize: '22px',
                color: 'rgb(33, 33, 33)',
                padding: '24px 24px 30px'
            }
        };
    },
    render() {
        let style = this.getStyle();
        return (
            <div style={style.cardTitle}>{this.props.title}</div>
        );
    }
});

module.exports = CardTitle;
