let Reflux = require('reflux');

let Actions = Reflux.createActions([
  'login',

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
