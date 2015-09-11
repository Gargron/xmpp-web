let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');

let NotificationsStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.toggleNotificationsSetting, this.onToggleNotificationsSetting);
    this.listenTo(Actions.toggleSoundsSetting, this.onToggleSoundsSetting);
    this.listenTo(Actions.messageReceived, this.onMessageReceived);
    this.listenTo(Actions.windowFocus, this.onWindowFocus);
    this.listenTo(Actions.windowFocusLost, this.onWindowFocusLost);
    this.getInitialState();
  },

  onToggleNotificationsSetting (e, val) {
    if (typeof Notification === 'undefined') {
      return;
    }

    if (val && Notification.permission !== 'granted') {
      Notification.requestPermission(function (permission) {
        if (permission !== 'granted') {
          return;
        }

        this.state = this.state.set('enabled', val);
        this.trigger(this.state);
        this._persist();
      }.bind(this));
    } else {
      this.state = this.state.set('enabled', val);
      this.trigger(this.state);
      this._persist();
    }
  },

  onToggleSoundsSetting (e, val) {
    this.state = this.state.set('sounds', val);
    this.trigger(this.state);
    this._persist();
  },


  onMessageReceived (stanza) {
    if (stanza.querySelectorAll('forwarded').length > 0) {
      stanza = stanza.querySelector('forwarded message');
    }

    if (stanza.querySelectorAll('body, sticker').length === 0) {
      return;
    }

    if (typeof Audio !== 'undefined' && this.state.get('sounds')) {
      let audio = new Audio('/sounds/notification_message.mp3');
      audio.play();
    }

    if (this.state.get('enabled') && !this.hasWindowFocus) {
      let from = Strophe.getBareJidFromJid(stanza.getAttribute('from'));
      let body;

      if (stanza.querySelectorAll('sticker').length > 0) {
        body = 'Sticker';
      } else {
        body = stanza.querySelector('body').textContent;
      }

      let n = new Notification(from, {
        body: body,
      });
    }
  },

  onWindowFocus () {
    this.hasWindowFocus = true;
  },

  onWindowFocusLost () {
    this.hasWindowFocus = false;
  },

  getInitialState () {
    if (typeof this.state === 'undefined') {
      this.state = Immutable.Map({
        enabled: false,
        sounds:  true,
      });

      this._load();

      if (Notification.permission !== 'granted') {
        this.state = this.state.set('enabled', false);
      }
    }

    if (typeof this.hasWindowFocus === 'undefined') {
      this.hasWindowFocus = true;
    }

    return this.state;
  },

  _persist () {
    localStorage['NotificationsStore'] = JSON.stringify(this.state.toJS());
  },

  _load () {
    if (typeof localStorage['NotificationsStore'] === 'undefined') {
      return;
    }

    this.state = Immutable.fromJS(JSON.parse(localStorage['NotificationsStore']));
  },

});

module.exports = NotificationsStore;
