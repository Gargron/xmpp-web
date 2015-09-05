let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');
let utils     = require('../utils');

let AccountStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.updateProfile, this.onUpdateProfile);
    this.listenTo(Actions.rosterReady, this.onRosterReady);
    this.getInitialState();
  },

  onConnection (connection) {
    this.connection = connection;

    let $this = this;

    this.connection.vcard.get(function (stanza) {
      if (stanza.querySelectorAll('NICKNAME').length > 0) {
        $this.account = $this.account.set('nickname', stanza.querySelector('NICKNAME').textContent);
      }

      if (stanza.querySelectorAll('PHOTO').length > 0) {
        $this.account = $this.account.set('photo', 'data:' + stanza.querySelector('PHOTO TYPE').textContent + ';base64,' + stanza.querySelector('PHOTO BINVAL').textContent);
      }

      $this.trigger($this.account);
    }, Strophe.getBareJidFromJid(connection.jid));
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

      $this.trigger($this.account);
      $this._announceUpdatedPhoto(photo);
    });
  },

  onRosterReady () {
    this._announcePresence();
  },

  getInitialState () {
    if (typeof this.account === 'undefined') {
      this.account = Immutable.Map({
        nickname: '',
        photo:    '',
        status:   '',
      });
    }

    return this.account;
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
    let stanza = $pres().c('status').t(this.account.get('status')).up().c('priority').t('40').up();
    this.connection.send(stanza);
  },

});

module.exports = AccountStore;
