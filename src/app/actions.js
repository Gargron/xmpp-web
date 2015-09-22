let Reflux = require('reflux');

let Actions = Reflux.createActions([
  'login',
  'loginFailed',
  'logout',
  'leave',

  'windowFocus',
  'windowFocusLost',
  'updateReady',

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
  'clearChat',

  'messageReceived',
  'messageMarked',
  'sendMessage',
  'sendStateChange',
  'loadArchive',
  'markMessage',
  'confirmMessageDelivery',

  'openEditProfileDialog',
  'updateProfile',
  'updateStatus',
  'profileUpdateReceived',

  'openNotificationsDialog',
  'toggleNotificationsSetting',
  'toggleSoundsSetting',

  'openPasswordDialog',
  'updatePassword',
]);

module.exports = Actions;
