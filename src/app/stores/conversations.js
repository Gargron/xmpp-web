let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');
let moment    = require('moment');

let ConversationsStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.messageReceived, this.onMessageReceived);
    this.listenTo(Actions.messageMarked, this.onMessageMarked);
    this.listenTo(Actions.sendMessage, this.onSendMessage);
    this.listenTo(Actions.sendStateChange, this.onSendStateChange);
    this.listenTo(Actions.logout, this.onLogout);
    this.listenTo(Actions.markMessage, this.onMarkMessage);
    this.getInitialState();
  },

  onConnection (connection) {
    this.connection = connection;
  },

  onMessageReceived (stanza) {
    if (stanza.querySelectorAll('forwarded').length > 0) {
      // XEP-0280: Message Carbons
      stanza = stanza.querySelector('forwarded message');
    }

    let from      = stanza.getAttribute('from');
    let to        = stanza.getAttribute('to');
    let fromJID   = Strophe.getBareJidFromJid(from);
    let toJID     = Strophe.getBareJidFromJid(to);
    let threadJID = fromJID;
    let msgID     = stanza.getAttribute('id');

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

      // Chat Markers
      let markers = stanza.querySelectorAll('received, displayed, acknowledged');

      if (markers.length > 0) {
        Actions.messageMarked(fromJID, markers[0].getAttribute('id'), markers[0].tagName);
      }

      return;
    }

    let body;
    let type;

    if (stanza.querySelectorAll('sticker').length > 0) {
      body = stanza.querySelector('sticker').getAttribute('uid');
      type = 'sticker';
    } else {
      body = stanza.querySelector('body').textContent;
      type = 'text';
    }

    let timestamp = moment().format();

    if (stanza.querySelectorAll('delay').length > 0) {
      timestamp = stanza.querySelector('delay').getAttribute('stamp');
    }

    if (stanza.querySelectorAll('markable').length > 0) {
      Actions.markMessage.triggerAsync(fromJID, msgID, 'received');
    }

    this.messages = this.messages.update(threadJID, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        id:     msgID,
        from:   fromJID,
        body:   body,
        time:   timestamp,
        type:   type,
        status: 'received',
      }));
    });

    this.trigger(this.messages);
    this._persist();
  },

  onMessageMarked (jid, id, marker) {
    id = id * 1;

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.map(function (item) {
        if (item.get('from') !== jid && item.get('id', 0) <= id) {
          return item.set('status', marker);
        } else {
          return item;
        }
      });
    });

    this.trigger(this.messages);
    this._persist();
  },

  onMarkMessage (jid, id, marker) {
    let sender = this.connection.jid;

    let stanza = $msg({
      from: sender,
      to:   jid,
    }).c(marker, {
      xmlns: Strophe.NS.CHAT_MARKERS,
      id:    id,
    }).up();

    this.connection.send(stanza);

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.map(function (item) {
        if (item.get('from') === jid && item.get('id') === id) {
          return item.set('status', marker);
        } else {
          return item;
        }
      });
    });

    this.trigger(this.messages);
  },

  onSendMessage (jid, body, type) {
    let sender = this.connection.jid;
    let msgID  = this.messages.get(jid, Immutable.List()).size + 1;

    let stanza = $msg({
      from: sender,
      to:   jid,
      type: 'chat',
      id:   msgID,
    });

    if (type === 'text') {
      stanza = stanza.c('body').t(body).up().c('active', {
        xmlns: Strophe.NS.CHATSTATES,
      }).up();
    } else if (type === 'sticker') {
      body = [body.org, body.pack, body.id].join('.');

      stanza = stanza.c('sticker', {
        xmlns: Strophe.NS.STICKERS,
        uid:   body,
      }).up();
    }

    stanza = stanza.c('markable', { xmlns: Strophe.NS.CHAT_MARKERS });

    this.connection.send(stanza);

    this.messages = this.messages.update(jid, Immutable.List(), function (val) {
      return val.push(Immutable.Map({
        id:     msgID,
        from:   Strophe.getBareJidFromJid(sender),
        body:   body,
        time:   moment().format(),
        type:   type,
        status: 'sending',
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
