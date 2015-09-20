let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');
let utils     = require('../utils');

const BOSH_URL    = 'https://zeonfed.org/http-bind';
const STORE_NAME  = 'ConnectionStore';
const CLIENT_NAME = 'XMPP Web';

let ConnectionStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.login, this.onLogin);
    this.listenTo(Actions.logout, this.onLogout);
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.connectionLost, this.onConnectionLost);
    this.listenTo(Actions.attemptReconnection, this.onAttemptReconnection);
    this.getInitialState();
  },

  onLogin (jid, password) {
    this.loggedIn   = true;
    this.jid        = jid;
    this.password   = password;
    this.connection = new Strophe.Connection(BOSH_URL);

    let resource = Strophe.getResourceFromJid(this.jid);

    if (!resource) {
      resource = 'web';
    }

    this.jid = Strophe.getBareJidFromJid(this.jid) + '/' + resource;

    this._persist();
    this._notify();
    this._registerConnectionHandlers();
    this._connect();
  },

  onLogout () {
    if (this.connection != null) {
      Actions.leave();
      this.connection.disconnect();
    }

    this.loggedIn   = false;
    this.connection = null;
    this.jid        = null;
    this.password   = null;

    this._persist();
    this._notify();
  },

  onConnection () {
    clearTimeout(this.reconnectionTimeout);

    this.connection.disco.addIdentity('client', 'web', CLIENT_NAME);
    this.connection.disco.addFeature(Strophe.NS.VCARD);
    this.connection.disco.addFeature(Strophe.NS.CHATSTATES);
    this.connection.disco.addFeature(Strophe.NS.BOSH);
    this.connection.disco.addFeature(Strophe.NS.DISCO_INFO);
    this.connection.disco.addFeature(Strophe.NS.CARBONS);
    this.connection.disco.addFeature(Strophe.NS.VERSION);
    this.connection.disco.addFeature(Strophe.NS.LAST_ACTIVITY);
    this.connection.disco.addFeature(Strophe.NS.CHAT_MARKERS);
    this.connection.disco.addFeature(Strophe.NS.RECEIPTS);

    window.connection = this.connection;

    this._enableCarbons();
  },

  onConnectionLost () {
    let $this = this;

    this.reconnectionTimeout = setTimeout(function () {
      Actions.attemptReconnection();
    }, 5000);
  },

  onAttemptReconnection () {
    clearTimeout(this.reconnectionTimeout);

    if (!this.loggedIn) {
      return;
    }

    this._connect();
  },

  _enableCarbons () {
    let stanza = $iq({
      from: this.connection.jid,
      id:   'enable_carbons',
      type: 'set',
    }).c('enable', { xmlns: Strophe.NS.CARBONS }).up();

    this.connection.send(stanza);
  },

  getInitialState () {
    if (typeof this.jid === 'undefined') {
      this.jid = null;
    }

    if (typeof this.password === 'undefined') {
      this.password = null;
    }

    if (typeof this.loggedIn === 'undefined') {
      this.loggedIn = false;
    }

    this._load();

    if (typeof this.connection === 'undefined') {
      this.connection = null;

      if (this.loggedIn) {
        Actions.login(this.jid, this.password);
      }
    }

    return {
      loggedIn:   this.loggedIn,
      jid:        this.jid,
      password:   this.password,
      connection: this.connection,
    };
  },

  _notify () {
    this.trigger({
      loggedIn:   this.loggedIn,
      jid:        this.jid,
      password:   this.password,
      connection: this.connection,
    });
  },

  _persist () {
    localStorage[STORE_NAME] = JSON.stringify({
      loggedIn: this.loggedIn,
      jid:      this.jid,
      password: this.password,
    });
  },

  _load () {
    if (typeof localStorage[STORE_NAME] === 'undefined') {
      return;
    }

    let json  = localStorage[STORE_NAME];
    let state = JSON.parse(json);

    this.loggedIn = state.loggedIn;
    this.jid      = state.jid;
    this.password = state.password;
  },

  _registerConnectionHandlers () {
    let $this = this;

    // The Strophe roster plugin handles roster changes, but we get notified
    this.connection.roster.registerCallback(function (items, item, previousItem) {
      Actions.rosterChange(items);
    });

    // Handle incoming messages
    this.connection.addHandler(function (stanza) {
      Actions.messageReceived(stanza);
      return true;
    }, null, 'message', null);

    // Handler for presence stanzas that pass by Strophe plugins
    this.connection.addHandler(function (stanza) {
      let from = stanza.getAttribute('from');
      let jid  = Strophe.getBareJidFromJid(from);
      let type = stanza.getAttribute('type');

      if (type === 'subscribe') {
        Actions.rosterRequestReceived(jid);
      } else if (type === 'subscribed') {
        Actions.ackSubscribe(jid);
      } else if (type === 'unsubscribed') {
        Actions.removeFromRoster(jid);
      } else {
        let x = stanza.querySelector('x');

        if (x != null && x.getAttribute('xmlns') === Strophe.NS.VCARD_UPDATES) {
          Actions.profileUpdateReceived(stanza);
        }
      }

      return true;
    }, null, 'presence', null, null, null);

    this.connection.addHandler(function (stanza) {
      let query = stanza.querySelector('query');

      if (query != null && query.getAttribute('xmlns') === Strophe.NS.VERSION) {
        let res = $iq({
          type: 'result',
          to:   stanza.getAttribute('from'),
          from: stanza.getAttribute('to'),
          id:   stanza.getAttribute('id'),
        }).c('query', { xmlns: Strophe.NS.VERSION }).c('name').t('XMPP Web').up().up();

        $this.connection.send(res);
      }

      if (query != null && query.getAttribute('xmlns') === Strophe.NS.LAST_ACTIVITY) {
        let res = $iq({
          type: 'result',
          to:   stanza.getAttribute('from'),
          from: stanza.getAttribute('to'),
          id:   stanza.getAttribute('id'),
        }).c('query', { xmlns: Strophe.NS.LAST_ACTIVITY, seconds: 0 }).up();

        $this.connection.send(res);
      }

      return true;
    }, null, 'iq', 'get', null, null);
  },

  _connect () {
    let $this = this;

    this.connection.connect(this.jid, this.password, function (status, errorCode) {
      // console.log('Connection status', status, errorCode);

      if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
        Actions.connection($this.connection);
      } else if (status === Strophe.Status.DISCONNECTED) {
        Actions.connectionLost();
      } else if (status === Strophe.Status.AUTHFAIL) {
        Actions.loginFailed();
      } else if (status === Strophe.Status.ERROR) {
        console.log('Error', errorCode);
      }
    });
  },

});

module.exports = ConnectionStore;
