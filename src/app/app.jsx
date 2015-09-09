(function () {
  require('script!strophe/strophe.js');
  require('script!strophejs-plugins/roster/strophe.roster.js');
  require('script!strophejs-plugins/disco/strophe.disco.js');
  require('script!strophejs-plugins/vcard/strophe.vcard.js');
  require('script!strophejs-plugins/rsm/strophe.rsm.js');
  // require('script!strophejs-plugins/mam/strophe.mam.v0.3.js');
  require('script!./vendor/sha1.js');
  require('script!./vendor/lib-typedarrays.js');

  Strophe.addNamespace('CARBONS',       'urn:xmpp:carbons:2');
  Strophe.addNamespace('CHATSTATES',    'http://jabber.org/protocol/chatstates');
  Strophe.addNamespace('STICKERS',      'http://jabber.zeonfederated.com/protocol/stickers');
  Strophe.addNamespace('VCARD_UPDATES', 'vcard-temp:x:update');
  Strophe.addNamespace('REGISTRATION',  'jabber:iq:register');
  Strophe.addNamespace('LAST_ACTIVITY', 'jabber:iq:last');
  Strophe.addNamespace('CHAT_MARKERS',  'urn:xmpp:chat-markers:0');

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

  // Try to communicate a proper disconnect before page closes
  window.onbeforeunload = function (e) {
    Actions.leave();
  };
})();
