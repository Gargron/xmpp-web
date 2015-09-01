let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');

let RosterStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.rosterChange, this.onRosterChange);
    this.listenTo(Actions.rosterRequestReceived, this.onRosterRequestReceived);
    this.listenTo(Actions.rosterStateChange, this.onRosterStateChange);
  },

  onConnection () {
    let $this = this;

    Connection.roster.get(function (items) {
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

  onRosterStateChange (jid, newState) {
    let itemIndex = this.roster.findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (itemIndex === -1) {
      return;
    }

    this.roster = this.roster.update(itemIndex, function (val) {
      console.log('State change', val.get('jid'), newState);
      return val.set('state', newState);
    });

    this._notify();
  },

  _updateRoster (newItems) {
    let vcardQueue = [];
    let $this = this;

    console.log('New items', newItems);

    this.roster = Immutable.List(newItems).map(function (item, index) {
      item = Immutable.fromJS(item);

      let oldItem = $this.roster.find(function (val) {
        return val.get('jid') === item.get('jid');
      });

      if (typeof oldItem === 'undefined') {
        console.log('New item', item.toJS());

        item = item.merge({
          vcard: {
            nickname: '',
            photo:    '',
          },
        });

        vcardQueue.push([item, index]);

        return item;
      }

      console.log('Merging items', oldItem.toJS(), item.toJS());

      return oldItem.merge(item);
    });

    vcardQueue.forEach(function (queueItem) {
      let item        = queueItem[0];
      let updateIndex = queueItem[1];

      console.log('Updating vcard for ' + item.get('jid'));

      Connection.vcard.get(function (stanza) {
        $this.roster = $this.roster.update(updateIndex, function (val) {
          val = val.merge({
            vcard: {
              nickname: stanza.querySelector('NICKNAME').textContent,
              photo:    'data:' + stanza.querySelector('PHOTO TYPE').textContent + ';base64,' + stanza.querySelector('PHOTO BINVAL').textContent,
            },
          });

          return val;
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

    if (u.getIn(['vcard', 'nickname']) !== '') {
      name    = u.getIn(['vcard', 'nickname']);
      initial = name.substr(0, 1).toUpperCase();
    }

    if (u.get('resources').size > 0) {
      let topResource = u.get('resources').maxBy(function (r) {
        return r.get('priority');
      });

      status = topResource.get('status');
    }


    if (u.getIn(['vcard', 'photo']) !== '') {
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
    let stanza = $pres().c('show').t('chat').up().c('status').t('Testing XMPP Web').up();
    Connection.send(stanza);
  },

});

module.exports = RosterStore;
