let Reflux    = require('reflux');
let Actions   = require('../actions');
let Immutable = require('immutable');
let moment    = require('moment');
let utils     = require('../utils');

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
    this.connection.roster.unauthorize(jid);
    this.connection.roster.unsubscribe(jid);
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

    // console.log('New state for ' + jid, newState);

    this.trigger(this.roster);
  },

  onMessageReceived (stanza) {
    if (stanza.querySelectorAll('body').length === 0) {
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

    this.roster = this.roster.update(itemIndex, function (val) {
      val = val.set('unread', val.get('unread') + 1);
      val = val.set('last_activity', moment().format());

      return val;
    });

    this._sortByLastActivity();
    this.trigger(this.roster);
  },

  onSendMessage (jid, body) {
    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    this.roster = this.roster.update(itemIndex, function (val) {
      return val.set('last_activity', moment().format());
    });

    this._sortByLastActivity();
    this.trigger(this.roster);
  },

  _sortByLastActivity () {
    this.roster = this.roster.sort(function (a, b) {
      if (a.get('last_activity') === null && b.get('last_activity') === null) {
        return 0;
      }

      if (a.get('last_activity') === null && b.get('last_activity') != null) {
        return 1;
      }

      if (b.get('last_activity') === null && a.get('last_activity') != null) {
        return -1;
      }

      if (moment(a.get('last_activity')).isBefore(b.get('last_activity'))) {
        return 1;
      } else {
        return -1;
      }
    });
  },

  onOpenChat (jid) {
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
    let $this = this;

    // console.log('New items', newItems);

    this.roster = Immutable.List(newItems).map(function (item, index) {
      item = Immutable.fromJS(item);

      let oldItem = $this.roster.find(function (val) {
        return val.get('jid') === item.get('jid');
      });

      if (typeof oldItem === 'undefined') {
        // console.log('New item', item.toJS());

        item = item.merge({
          vcard: {
            nickname: '',
            photo:    '',
          },

          unread: 0,
          last_activity: null,
        });

        vcardQueue.push([item, index]);

        return item;
      }

      // console.log('Merging items', oldItem.toJS(), item.toJS());

      return oldItem.merge(item);
    });

    vcardQueue.forEach(function (queueItem) {
      let item        = queueItem[0];
      let updateIndex = queueItem[1];

      // console.log('Updating vcard for ' + item.get('jid'));

      $this.connection.vcard.get(function (stanza) {
        $this.roster = $this.roster.update(updateIndex, function (val) {
          return val.merge(utils.parseVCard(stanza));
        });

        $this.trigger($this.roster);
      }, item.get('jid'));
    });

    this.trigger(this.roster);
  },

  getInitialState () {
    if (typeof this.roster === 'undefined') {
      this.roster = Immutable.List();
    }

    return this.roster;
  },

});

module.exports = RosterStore;
