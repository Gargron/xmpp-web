(function () {
  let React = require('react/addons');
  let injectTapEventPlugin = require('react-tap-event-plugin');
  let Style = require('./app.scss');
  let Main = require('./components/main.jsx');
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

  let Connection = new Strophe.Connection('http://zeonfed.org:5280/http-bind');

  Connection.connect('dummy@zeonfed.org', 'apache12', function (status) {
    if (status === Strophe.Status.CONNECTED) {
      Actions.connection();
    } else if (status === Strophe.Status.DISCONNECTED) {
      Actions.connectionLost();
    }
  });

  Connection.roster.registerCallback(function (items, item, previousItem) {
    Actions.rosterChange(items);
  });

  Connection.roster.registerRequestCallback(function (jid) {
    Actions.rosterRequestReceived(jid);
  });

  Connection.addHandler(function (message) {
    Actions.messageReceived(message);
    return true;
  }, null, 'message', 'chat');

  window.Connection = Connection;

})();
