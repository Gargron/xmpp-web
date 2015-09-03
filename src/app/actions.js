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

  'sendRosterRequest',
  'authorize',
  'reject',

  'openChat',

  'messageReceived',
  'sendMessage',

  'openEditProfileDialog',
  'updateProfile',
]);

module.exports = Actions;
