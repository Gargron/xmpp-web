let Reflux = require('reflux');

let Actions = Reflux.createActions([
  'login',
  'logout',

  'connection',
  'connectionLost',

  'rosterChange',
  'rosterRequestReceived',
  'rosterStateChange',

  'openChat',

  'messageReceived',
  'sendMessage',
]);

module.exports = Actions;
