let Reflux = require('reflux');

let Actions = Reflux.createActions([
  'login',
  'loginFailed',
  'logout',
  'leave',

  'connection',
  'connectionLost',
  'attemptReconnection',

  'rosterChange',
  'rosterRequestReceived',
  'rosterStateChange',
  'rosterReady',

  'resetUnreadCounter',

  'sendRosterRequest',
  'authorize',
  'reject',
  'removeFromRoster',
  'ackSubscribe',

  'openChat',
  'closeChat',

  'messageReceived',
  'messageMarked',
  'sendMessage',
  'sendStateChange',
  'loadArchive',
  'markMessage',

  'openEditProfileDialog',
  'updateProfile',
  'profileUpdateReceived',
]);

module.exports = Actions;
