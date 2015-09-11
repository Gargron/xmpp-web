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
  'confirmMessageDelivery',

  'openEditProfileDialog',
  'updateProfile',
  'profileUpdateReceived',

  'openNotificationsDialog',
  'toggleNotificationsSetting',
  'toggleSoundsSetting',

  'openPasswordDialog',
  'updatePassword',
]);

module.exports = Actions;
