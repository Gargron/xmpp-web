let Reflux    = require('reflux');
let Actions   = require('../actions');
let Immutable = require('immutable');
let moment    = require('moment');
let utils     = require('../utils');

const STORE_NAME = 'RosterStore';

let RosterStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.rosterChange, this.onRosterChange);
    this.listenTo(Actions.rosterStateChange, this.onRosterStateChange);
    this.listenTo(Actions.removeFromRoster, this.onRemoveFromRoster);
    this.listenTo(Actions.messageReceived, this.onMessageReceived);
    this.listenTo(Actions.sendMessage, this.onSendMessage);
    this.listenTo(Actions.resetUnreadCounter, this.onResetUnreadCounter);
    this.listenTo(Actions.openChat, this.onOpenChat);
    this.listenTo(Actions.profileUpdateReceived, this.onProfileUpdateReceived);
    this.listenTo(Actions.windowFocus, this.onWindowFocus);
    this.listenTo(Actions.windowFocusLost, this.onWindowFocusLost);
    this.listenTo(Actions.logout, this.onLogout);
    this.getInitialState();
  },

  onConnection (connection) {
    let $this = this;

    this.connection = connection;

    this.connection.roster.get(function (items) {
      $this._updateRoster(items);
      Actions.rosterReady();
    });
  },

  onRosterChange (items) {
    this._updateRoster(items);
  },

  onRemoveFromRoster (jid) {
    this.connection.roster.remove(jid);
  },

  onRosterStateChange (jid, newState) {
    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    this.roster = this.roster.update(itemIndex, function (val) {
      return val.set('state', newState);
    });

    this.trigger(this.roster);
  },

  onMessageReceived (stanza) {
    if (stanza.querySelectorAll('body, sticker').length === 0) {
      return;
    }

    let from = stanza.getAttribute('from');
    let jid  = Strophe.getBareJidFromJid(from);

    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    let unread;

    if (this.openChat === jid && this.hasWindowFocus) {
      unread = 0;
    } else {
      unread = this.roster.getIn([itemIndex, 'unread'], 0) + 1;
    }

    this.roster = this.roster.update(itemIndex, function (val) {
      return val.merge({
        unread:        unread,
        last_activity: moment().format(),
      });
    });

    this.trigger(this.roster);
  },

  onSendMessage (jid) {
    this._touch(jid);
  },

  _touch (jid) {
    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    this.roster = this.roster.update(itemIndex, function (val) {
      return val.set('last_activity', moment().format());
    });

    this.trigger(this.roster);
    this._persist();
  },

  onOpenChat (jid) {
    this.openChat = jid;
    this.onResetUnreadCounter(jid);
  },

  onResetUnreadCounter (jid) {
    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    if (this.roster.getIn([itemIndex, 'unread']) === 0) {
      return;
    }

    this.roster = this.roster.update(itemIndex, function (val) {
      return val.set('unread', 0);
    });

    this.trigger(this.roster);
  },

  _updateRoster (newItems) {
    let vcardQueue = [];
    let lastSeenQueue = [];
    let $this = this;

    let intermediate = Immutable.List(newItems).map(function (item, index) {
      item = Immutable.fromJS(item);

      let oldItem = $this.roster.find(function (val) {
        return val.get('jid') === item.get('jid');
      });

      if (typeof oldItem === 'undefined') {
        item = item.merge({
          vcard: {
            nickname: '',
            photo:    '',
          },

          unread: 0,
          last_activity: null,
          last_seen: null,
        });

        vcardQueue.push([item, index]);
        lastSeenQueue.push([item, index]);

        return item;
      } else if (oldItem.get('resources').size > 0 && item.get('resources').size === 0) {
        // Contact went offline
        lastSeenQueue.push([item, index]);
      }

      // If we just loaded old data, re-check vCards too
      if (oldItem.get('_cold', false) === true) {
        oldItem = oldItem.set('_cold', false);
        vcardQueue.push([oldItem, index]);
      }

      return oldItem.merge(item);
    });

    this.roster = intermediate;

    vcardQueue.forEach(function (queueItem) {
      $this._checkVCard.apply($this, queueItem);
    });

    lastSeenQueue.forEach(function (queueItem) {
      $this._checkLastSeen.apply($this, queueItem);
    });

    this.trigger(this.roster);
    this._persist();
  },

  _checkVCard (item, index) {
    let $this = this;

    this.connection.vcard.get(function (stanza) {
      $this.roster = $this.roster.update(index, function (val) {
        return val.merge(utils.parseVCard(stanza));
      });

      $this.trigger($this.roster);
      $this._persist();
    }, item.get('jid'));
  },

  _checkLastSeen (item, index) {
    let $this = this;

    let iq = $iq({
      type: 'get',
      to:   item.get('jid'),
    }).c('query', { xmlns: Strophe.NS.LAST_ACTIVITY }).up();

    this.connection.sendIQ(iq, function (stanza) {
      let query = stanza.querySelector('query');

      if (query != null) {
        let seconds = query.getAttribute('seconds');

        $this.roster = $this.roster.update(index, function (val) {
          return val.set('last_seen', moment().subtract(seconds, 'seconds').format());
        });
      }

      $this.trigger($this.roster);
      $this._persist();
    });
  },

  onProfileUpdateReceived (stanza) {
    let from = stanza.getAttribute('from');
    let jid  = Strophe.getBareJidFromJid(from);

    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    let $this = this;

    this.connection.vcard.get(function (_stanza) {
      $this.roster = $this.roster.update(itemIndex, function (val) {
        return val.merge(utils.parseVCard(_stanza));
      });

      $this.trigger($this.roster);
      $this._persist();
    }, jid);
  },

  onWindowFocus () {
    this.hasWindowFocus = true;
  },

  onWindowFocusLost () {
    this.hasWindowFocus = false;
  },

  getInitialState () {
    if (typeof this.roster === 'undefined') {
      this.roster = Immutable.List();
      this._load();
    }

    if (typeof this.openChat === 'undefined') {
      this.openChat = false;
    }

    if (typeof this.hasWindowFocus === 'undefined') {
      this.hasWindowFocus = true;
    }

    return this.roster;
  },

  onLogout () {
    localStorage.removeItem(STORE_NAME);
  },

  _load () {
    if (typeof localStorage[STORE_NAME] === 'undefined') {
      return;
    }

    this.roster = Immutable.fromJS(JSON.parse(localStorage[STORE_NAME]));
  },

  _persist () {
    localStorage[STORE_NAME] = JSON.stringify(this.roster.map(function (val) {
      // When we later load this from store, the contact might be offline
      // So we remove all ephermal information about them
      return val.withMutations(function (map) {
        return map.set('resources', []).set('state', null).set('unread', 0).set('_cold', true);
      });
    }).toJS());
  },

});

module.exports = RosterStore;
