let Reflux = require('reflux');

let Actions = Reflux.createActions([
  'login',
  'loginFailed',
  'logout',

  'connection',
  'connectionLost',

  'rosterChange',
  'rosterRequestReceived',
  'rosterStateChange',

  'authorize',
  'reject',

  'openChat',

  'messageReceived',
  'sendMessage',
]);

module.exports = Actions;
