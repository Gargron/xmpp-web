let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');

let RosterStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.rosterChange, this.onRosterChange);
    this.listenTo(Actions.rosterRequestReceived, this.onRosterRequestReceived);
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

  _updateRoster (newItems) {
    let vcardQueue = [];
    let $this = this;

    this.roster = this.roster.merge(newItems);

    this.roster = this.roster.map(function (item, index) {
      if (!item.has('vcard')) {
        item = item.set('vcard', Immutable.Map({
          nickname: '',
          photo: '',
        }));
      }

      if (!item.has('stanza')) {
        item = item.set('stanza', null);
        vcardQueue.push([item, index]);
      }

      return item;
    });

    vcardQueue.forEach(function (queueItem) {
      let item        = queueItem[0];
      let updateIndex = queueItem[1];

      Connection.vcard.get(function (stanza) {
        $this.roster = $this.roster.update(updateIndex, function (val) {
          val = val.merge({
            stanza: stanza,

            vcard: {
              nickname: stanza.querySelector('NICKNAME').textContent,
              photo: 'data:' + stanza.querySelector('PHOTO TYPE').textContent + ';base64,' + stanza.querySelector('PHOTO BINVAL').textContent,
            },
          });

          return val;
        });

        $this._notify();
      }, item.get('jid'));
    });

    this._notify();
    Connection.send($pres().tree());
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

});

module.exports = RosterStore;
