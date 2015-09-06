let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');
let utils     = require('../utils');

const BOSH_URL = 'http://web.zeonfed.org/http-bind';

let ConnectionStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.login, this.onLogin);
    this.listenTo(Actions.logout, this.onLogout);
    this.listenTo(Actions.connection, this.onConnection);
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
    this._enableCarbons();
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
    localStorage['ConnectionStore'] = JSON.stringify({
      loggedIn: this.loggedIn,
      jid:      this.jid,
      password: this.password,
    });
  },

  _load () {
    if (typeof localStorage['ConnectionStore'] === 'undefined') {
      return;
    }

    let json  = localStorage['ConnectionStore'];
    let state = JSON.parse(json);

    this.loggedIn = state.loggedIn;
    this.jid      = state.jid;
    this.password = state.password;
  },

  _registerConnectionHandlers () {
    let $this = this;

    this.connection.disco.addIdentity('client', 'web', 'XMPP Web');
    this.connection.disco.addFeature(Strophe.NS.VCARD);
    this.connection.disco.addFeature(Strophe.NS.CHATSTATES);
    this.connection.disco.addFeature(Strophe.NS.BOSH);
    this.connection.disco.addFeature(Strophe.NS.DISCO_INFO);
    this.connection.disco.addFeature(Strophe.NS.CARBONS);

    // The Strophe roster plugin handles roster changes, but we get notified
    this.connection.roster.registerCallback(function (items, item, previousItem) {
      Actions.rosterChange(items);
    });

    // Handle incoming messages
    this.connection.addHandler(function (message) {
      Actions.messageReceived(message);
      return true;
    }, null, 'message', 'chat');

    // Handler for presence stanzas that pass by Strophe plugins
    this.connection.addHandler(function (stanza) {
      // console.log(1, stanza);

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

    this.connection.connect(this.jid, this.password, function (status, errorCode) {
      // console.log('Connection status', status, errorCode);

      if (status === Strophe.Status.CONNECTED) {
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
