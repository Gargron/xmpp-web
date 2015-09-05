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
    this.listenTo(Actions.sendSticker, this.onSendSticker);
    this.listenTo(Actions.logout, this.onLogout);
    this.getInitialState();
  },

  onConnection (connection) {
    this.connection = connection;
  },

  onMessageReceived (stanza) {
    // console.log(stanza);

    if (stanza.querySelectorAll('forwarded').length > 0) {
      // XEP-0280: Message Carbons
      stanza = stanza.querySelector('forwarded message');
    }

    let from      = stanza.getAttribute('from');
    let to        = stanza.getAttribute('to');
    let fromJID   = Strophe.getBareJidFromJid(from);
    let toJID     = Strophe.getBareJidFromJid(to);
    let threadJID = fromJID;

    if (fromJID === Strophe.getBareJidFromJid(this.connection.jid)) {
      // XEP-0280: Message Carbons
      threadJID = toJID;
    }

    if (stanza.querySelectorAll('body, sticker').length === 0) {
      // Chat State Notification
      let states = stanza.querySelectorAll('active, composing, inactive, paused, gone');

      if (states.length > 0) {
        Actions.rosterStateChange(fromJID, states[0].tagName);
      }

      return;
    }

    let body;
    let type;

    if (stanza.querySelectorAll('sticker').length > 0) {
      body = stanza.querySelector('sticker').getAttribute('url');
      type = 'sticker';
    } else {
      body = stanza.querySelector('body').textContent;
      type = 'text';
    }

    let timestamp = moment().format();

    if (stanza.querySelectorAll('delay').length > 0) {
      timestamp = stanza.querySelector('delay').getAttribute('stamp');
    }

    this.messages = this.messages.update(threadJID, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        from: fromJID,
        body: body,
        time: timestamp,
        type: type,
      }));
    });

    this.trigger(this.messages);
    this._persist();
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
        type: 'text',
      }));
    });

    this.trigger(this.messages);
    this._persist();
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

  onSendSticker (jid, stickerUrl) {
    let sender = this.connection.jid;

    let stanza = $msg({
      from: sender,
      to:   jid,
      type: 'chat',
    }).c('sticker', {
      xmlns: Strophe.NS.STICKERS,
      url:   stickerUrl,
    }).up();

    this.connection.send(stanza);

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        from: Strophe.getBareJidFromJid(sender),
        body: stickerUrl,
        time: moment().format(),
        type: 'sticker',
      }));
    });

    this.trigger(this.messages);
    this._persist();
  },

  onLogout () {
    localStorage.removeItem('ConversationsStore');
  },

  getInitialState () {
    if (typeof this.messages === 'undefined') {
      this.messages = Immutable.Map();
    }

    this._load();

    return this.messages;
  },

  _load () {
    if (typeof localStorage['ConversationsStore'] === 'undefined') {
      return;
    }

    this.messages = Immutable.fromJS(JSON.parse(localStorage['ConversationsStore']));
  },

  _persist () {
    localStorage['ConversationsStore'] = JSON.stringify(this.messages.toJS());
  },

});

module.exports = ConversationsStore;
