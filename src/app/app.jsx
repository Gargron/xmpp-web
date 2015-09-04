(function () {
  require('script!strophe/strophe.js');
  require('script!strophe-plugins/roster.js');
  require('script!strophe-plugins/vcard.js')
  require('script!./vendor/sha1.js');
  require('script!./vendor/lib-typedarrays.js');

  let React   = require('react/addons');
  let injectTapEventPlugin = require('react-tap-event-plugin');
  let Main    = require('./components/main');
  let Actions = require('./actions');
  let ConnectionStore = require('./stores/connection');
  let Perf    = React.addons.Perf;

  //Needed for React Developer Tools
  window.React = React;
  window.Perf  = Perf;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // Render the main app react component into the document body.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  React.render(<Main />, document.body);

})();
