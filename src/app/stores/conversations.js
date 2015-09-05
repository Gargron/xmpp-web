let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');
let moment    = require('moment');

let ConversationsStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.messageReceived, this.onMessageReceived);
    this.listenTo(Actions.sendMessage, this.onSendMessage);
    this.listenTo(Actions.sendStateChange, this.onSendStateChange);
    this.getInitialState();
  },

  onConnection (connection) {
    this.connection = connection;
  },

  onMessageReceived (stanza) {
    let from = stanza.getAttribute('from');
    let jid  = Strophe.getBareJidFromJid(from);

    if (stanza.querySelectorAll('body').length === 0) {
      // Chat State Notification
      let states = stanza.querySelectorAll('active, composing, inactive, paused, gone');

      if (states.length > 0) {
        Actions.rosterStateChange(jid, states[0].tagName);
      }

      return;
    }

    let body = stanza.querySelector('body').textContent;

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        from: from,
        body: body,
        time: moment().format(),
      }));
    });

    this.trigger(this.messages);
  },

  onSendMessage (jid, body) {
    let sender = this.connection.jid;

    let stanza = $msg({
      from: sender,
      to:   jid,
      type: 'chat',
    }).c('body').t(body).up().c('active', {
      xmlns: Strophe.NS.CHATSTATES,
    }).up();

    this.connection.send(stanza);

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        from: Strophe.getBareJidFromJid(sender),
        body: body,
        time: moment().format(),
      }));
    });

    this.trigger(this.messages);
  },

  onSendStateChange (jid, state) {
    let sender = this.connection.jid;

    let stanza = $msg({
      from: sender,
      to:   jid,
      type: 'chat',
    }).c(state, {
      xmlns: Strophe.NS.CHATSTATES,
    }).up();

    this.connection.send(stanza);
  },

  getInitialState () {
    if (typeof this.messages === 'undefined') {
      this.messages = Immutable.Map();
    }

    return this.messages;
  },

});

module.exports = ConversationsStore;
