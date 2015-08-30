let Reflux = require('reflux');

let Actions = Reflux.createActions([
  'connection',
  'connectionLost',
  'rosterChange',
  'openChat',
  'rosterRequestReceived',
  'messageReceived',
]);

module.exports = Actions;
