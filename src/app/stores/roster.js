let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');

let ConnectionStore = require('./connection');

let stanzaToVCard = function (stanza) {
  let nickname = '';
  let photo    = '';

  if (stanza.querySelectorAll('NICKNAME').length > 0) {
    nickname = stanza.querySelector('NICKNAME').textContent;
  }

  if (stanza.querySelectorAll('N').length > 0) {
    if (stanza.querySelectorAll('N GIVEN').length > 0) {
      nickname = stanza.querySelector('N GIVEN').textContent;
    }

    if (stanza.querySelectorAll('N FAMILY').length > 0) {
      nickname = nickname + " " + stanza.querySelector('N FAMILY').textContent;
    }
  }

  if (stanza.querySelectorAll('PHOTO').length > 0) {
    photo = 'data:' + stanza.querySelector('PHOTO TYPE').textContent + ';base64,' + stanza.querySelector('PHOTO BINVAL').textContent;
  }

  return {
    vcard: {
      nickname: nickname,
      photo:    photo,
    },
  };
};

let RosterStore = Reflux.createStore({

  init () {
    this.listenTo(ConnectionStore, this.onConnectionStore);
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.rosterChange, this.onRosterChange);
    this.listenTo(Actions.rosterRequestReceived, this.onRosterRequestReceived);
    this.listenTo(Actions.rosterStateChange, this.onRosterStateChange);
    this.listenTo(Actions.authorize, this.onAuthorize);
    this.listenTo(Actions.reject, this.onReject);
    this.listenTo(Actions.sendRosterRequest, this.onSendRosterRequest);
  },

  onConnectionStore (store) {
    this.connection = store.connection;
    this.status     = store.account.get('status');
  },

  onConnection (connection) {
    let $this = this;

    this.connection = connection;

    this.connection.roster.get(function (items) {
      $this._updateRoster(items);
    });
  },

  onRosterChange (items) {
    this._updateRoster(items);
  },

  onRosterRequestReceived (jid) {
    this.queue = this.queue.push(jid);
    this._notify();
  },

  onSendRosterRequest (jid) {
    this.connection.roster.subscribe(jid);
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

    this._notify();
  },

  onAuthorize (jid) {
    this.connection.roster.authorize(jid);
    this.connection.roster.subscribe(jid);
  },

  onReject (jid) {
    this.connection.roster.unauthorize(jid);

    let itemIndex = this.queue.indexOf(jid);

    if (itemIndex === -1) {
      return;
    }

    this.queue = this.queue.delete(itemIndex);
    this._notify();
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
          return val.merge(stanzaToVCard(stanza));
        });

        $this._notify();
      }, item.get('jid'));
    });

    this._notify();
    this._announcePresence();
  },

  get (jid) {
    if (typeof this.roster === 'undefined') {
      return;
    }

    return this.roster.find(function (item) {
      return item.get('jid') === jid;
    });
  },

  extractDisplayData (u, defaultJID) {
    if (typeof u === 'undefined') {
      return {
        jid:     defaultJID,
        name:    defaultJID,
        initial: defaultJID.substr(0, 1).toUpperCase(),
        photo:   '',
        status:  'Not in your contacts',
        state:   '',
      };
    }

    let jid     = u.get('jid');
    let name    = jid;
    let initial = name.substr(0, 1).toUpperCase();
    let status  = 'Offline';
    let photo   = '';

    if (u.getIn(['vcard', 'nickname'], '') !== '') {
      name    = u.getIn(['vcard', 'nickname']);
      initial = name.substr(0, 1).toUpperCase();
    }

    if (u.get('name', null) != null) {
      name    = u.get('name');
      initial = name.substr(0, 1).toUpperCase();
    }

    if (u.get('resources', []).size > 0) {
      let topResource = u.get('resources').maxBy(function (r) {
        return r.get('priority');
      });

      status = topResource.get('status');
    }


    if (u.getIn(['vcard', 'photo'], '') !== '') {
      photo = u.getIn(['vcard', 'photo']);
    }

    return {
      jid:     jid,
      name:    name,
      initial: initial,
      photo:   photo,
      status:  status,
      state:   u.get('state'),
    };
  },

  getInitialState () {
    if (typeof this.roster === 'undefined') {
      this.roster = Immutable.List();
    }

    if (typeof this.queue === 'undefined'){
      this.queue  = Immutable.List();
    }

    return {
      queue:  this.queue,
      roster: this.roster,
    };
  },

  _notify () {
    this.trigger({
      queue:  this.queue,
      roster: this.roster,
    });
  },

  _announcePresence () {
    let stanza = $pres().c('status').t(this.status).up();
    this.connection.send(stanza);
  },

});

module.exports = RosterStore;
