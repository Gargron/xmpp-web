let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');

let ConnectionStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.login, this.onLogin);
    this.listenTo(Actions.logout, this.onLogout);
    this.listenTo(Actions.connection, this.onConnection);
  },

  onLogin (jid, password) {
    this.loggedIn   = true;
    this.jid        = jid;
    this.password   = password;
    this.connection = new Strophe.Connection('http://zeonfed.org:5280/http-bind');

    this._persist();
    this._notify();
    this._registerConnectionHandlers();
  },

  onLogout () {
    if (this.connection != null) {
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
    let $this = this;

    this.connection.vcard.get(function (stanza) {
      if (stanza.querySelectorAll('NICKNAME').length > 0) {
        $this.account = $this.account.set('nickname', stanza.querySelector('NICKNAME').textContent);
      }

      if (stanza.querySelectorAll('PHOTO').length > 0) {
        $this.account = $this.account.set('photo', 'data:' + stanza.querySelector('PHOTO TYPE').textContent + ';base64,' + stanza.querySelector('PHOTO BINVAL').textContent);
      }

      $this._notify();
    }, this.jid);
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
        this.connection = new Strophe.Connection('http://zeonfed.org:5280/http-bind');
        this._registerConnectionHandlers();
      }
    }

    if (typeof this.account === 'undefined') {
      this.account = Immutable.Map({
        nickname: '',
        photo:    '',
        status:   'Online in XMPP Web',
      });
    }

    return {
      loggedIn:   this.loggedIn,
      jid:        this.jid,
      password:   this.password,
      connection: this.connection,
      account:    this.account,
    };
  },

  _notify () {
    this.trigger({
      loggedIn:   this.loggedIn,
      jid:        this.jid,
      password:   this.password,
      connection: this.connection,
      account:    this.account,
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

    this.connection.connect(this.jid, this.password, function (status) {
      console.log('Connection status', status);

      if (status === Strophe.Status.CONNECTED) {
        Actions.connection($this.connection);
      } else if (status === Strophe.Status.DISCONNECTED) {
        Actions.connectionLost();
      } else if (status === Strophe.Status.AUTHFAIL) {
        Actions.loginFailed();
      }
    });

    this.connection.roster.registerCallback(function (items, item, previousItem) {
      Actions.rosterChange(items);
    });

    this.connection.roster.registerRequestCallback(function (jid) {
      Actions.rosterRequestReceived(jid);
    });

    this.connection.addHandler(function (message) {
      Actions.messageReceived(message);
      return true;
    }, null, 'message', 'chat');
  },

});

module.exports = ConnectionStore;
