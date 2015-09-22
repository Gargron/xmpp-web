let Reflux       = require('reflux');
let Actions      = require('../actions.js');
let Immutable    = require('immutable');
let RosterStore  = require('./roster');
let AccountStore = require('./account');

let RosterQueueStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
    this.listenTo(Actions.rosterChange, this.onRosterChange);
    this.listenTo(Actions.rosterRequestReceived, this.onRosterRequestReceived);
    this.listenTo(Actions.sendRosterRequest, this.onSendRosterRequest);
    this.listenTo(Actions.authorize, this.onAuthorize);
    this.listenTo(Actions.reject, this.onReject);
    this.getInitialState();
  },

  onConnection (connection) {
    this.connection = connection;
  },

  onRosterRequestReceived (jid) {
    let haveInContacts = RosterStore.getInitialState().findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (haveInContacts === -1) {
      this.queue = this.queue.push(jid);
      this.trigger(this.queue);
    } else {
      // If the person who wants to subscribe to us is someone we wanted to add
      // Don't require user interaction to authorize them
      Actions.authorize(jid);
    }
  },

  onRosterChange (items) {
    let $this = this;

    // Let's say from a different client we authorized a contact request
    // So it appears on our roster. We gotta remove it from the queue!
    items.forEach(function (item) {
      let isInQueue = $this.queue.indexOf(item.jid);

      if (isInQueue === -1) {
        return;
      }

      $this._removeFromQueue(item.jid);
    });
  },

  onSendRosterRequest (jid) {
    this.connection.roster.add(jid, "", []);
    this.connection.roster.subscribe(jid);
  },

  onAuthorize (jid) {
    // When we authorize someone, we need to send them our current status message
    // Since they wouldn't have the one we broadcasted previously
    this.connection.roster.authorize(jid, AccountStore.getInitialState().account.get('status'));
    this.connection.roster.subscribe(jid);
    this._removeFromQueue(jid);
  },

  onReject (jid) {
    this.connection.roster.unauthorize(jid);
    this._removeFromQueue(jid);
  },

  _removeFromQueue (jid) {
    this.queue = this.queue.delete(this.queue.indexOf(jid));
    this.trigger(this.queue);
  },

  getInitialState () {
    if (typeof this.queue === 'undefined') {
      this.queue = Immutable.List();
    }

    return this.queue;
  },

});

module.exports = RosterQueueStore;
