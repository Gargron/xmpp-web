(function () {
  let React   = require('react/addons');
  let injectTapEventPlugin = require('react-tap-event-plugin');
  let Style   = require('./app.scss');
  let Main    = require('./components/main.jsx');
  let Actions = require('./actions.js');

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // Render the main app react component into the document body.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  React.render(<Main />, document.body);

  window.onunload = function () {
    React.unmountComponentAtNode(document.body);
  };
})();
