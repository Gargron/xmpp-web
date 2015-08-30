let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');
let moment    = require('moment');

let ConversationsStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.openChat, this.onOpenChat);
    this.listenTo(Actions.messageReceived, this.onMessageReceived);
  },

  onOpenChat (jid) {
    this.opened = jid;
    this._notify();
  },

  onMessageReceived (stanza) {
    if (stanza.querySelectorAll('body').length === 0) {
      // Chat State Notification
      return;
    }

    let from = stanza.getAttribute('from');
    let jid  = Strophe.getBareJidFromJid(from);
    let body = stanza.querySelector('body').textContent;
    let id   = stanza.getAttribute('id');

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        id:   id,
        from: from,
        body: body,
        time: moment().format(),
      }));
    });

    this._notify();
  },

  getInitialState () {
    if (typeof this.opened === 'undefined') {
      this.opened = false;
    }

    if (typeof this.messages === 'undefined') {
      this.messages = Immutable.Map();
    }

    return {
      opened:   this.opened,
      messages: this.messages,
    };
  },

  _notify () {
    this.trigger({
      opened:   this.opened,
      messages: this.messages,
    });
  },

});

module.exports = ConversationsStore;
