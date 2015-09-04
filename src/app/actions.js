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
  'rosterReady',

  'resetUnreadCounter',

  'sendRosterRequest',
  'authorize',
  'reject',
  'removeFromRoster',

  'openChat',
  'closeChat',

  'messageReceived',
  'sendMessage',

  'openEditProfileDialog',
  'updateProfile',
]);

module.exports = Actions;
