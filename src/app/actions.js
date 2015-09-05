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
  'sendStateChange',

  'openEditProfileDialog',
  'updateProfile',
  'profileUpdateReceived',

  'sendSticker',
]);

module.exports = Actions;
