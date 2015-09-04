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
    this.listenTo(Actions.updateProfile, this.onUpdateProfile);
    this.listenTo(Actions.rosterReady, this.onRosterReady);
    this.getInitialState();
  },

  onLogin (jid, password) {
    this.loggedIn   = true;
    this.jid        = jid;
    this.password   = password;
    this.connection = new Strophe.Connection(BOSH_URL);

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

  onRosterReady () {
    this._announcePresence();
  },

  onUpdateProfile (nickname, photo) {
    let $this  = this;

    let stanza = $iq({
      type: 'set',
      jid:  this.jid,
    }).c('vCard', { xmlns: Strophe.NS.VCARD });

    if (nickname.length > 0) {
      stanza = stanza.c('NICKNAME').t(nickname).up();
    }

    if (photo.length > 0) {
      let fileType = photo.split(';')[0].split(':')[1];
      let fileBlob = photo.split(',')[1];

      stanza.c('PHOTO').c('TYPE').t(fileType).up().c('BINVAL').t(fileBlob).up().up();
    }

    this.connection.sendIQ(stanza, function () {
      $this.account = $this.account.set('nickname', nickname);
      $this.account = $this.account.set('photo', photo);

      $this._notify();
      $this._announceUpdatedPhoto(photo);
    });
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

    if (typeof this.account === 'undefined') {
      this.account = Immutable.Map({
        nickname: '',
        photo:    '',
        status:   'Online in XMPP Web',
      });
    }

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

    this.connection.addHandler(function (message) {
      Actions.messageReceived(message);
      return true;
    }, null, 'message', 'chat');

    this.connection.addHandler(function (stanza) {
      let jid  = stanza.getAttribute('from');
      let from = Strophe.getBareJidFromJid(jid);
      let type = stanza.getAttribute('type');

      if (type === 'subscribe') {
        Actions.rosterRequestReceived(from);
      }

      return true;
    }, null, 'presence', null, null, null);
  },

  _announceUpdatedPhoto (dataURL) {
    let stanza = $pres().c('x', { xmlns: 'vcard-temp:x:update' })

    if (dataURL === '') {
      stanza = stanza.c('photo').up();
    } else {
      let sha1sum = utils.imageToSha1(dataURL);
      stanza = stanza.c('photo').t(sha1sum).up().up();
    }

    this.connection.send(stanza);
  },

  _announcePresence () {
    let stanza = $pres().c('status').t(this.account.get('status')).up();
    this.connection.send(stanza);
  },

});

module.exports = ConnectionStore;
