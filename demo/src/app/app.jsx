(function () {
    let React = require('react/addons');
    let injectTapEventPlugin = require('react-tap-event-plugin');
    let Main = require('./components/main.jsx');

    window.React = React;
    injectTapEventPlugin();
    React.render(<Main />, document.getElementById('container'), function() {});
})();
