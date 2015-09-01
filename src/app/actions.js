let Reflux = require('reflux');

let Actions = Reflux.createActions([
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
