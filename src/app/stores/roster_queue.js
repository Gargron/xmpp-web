let Reflux    = require('reflux');
let Actions   = require('../actions.js');
let Immutable = require('immutable');

let RosterQueueStore = Reflux.createStore({

  init () {
    this.listenTo(Actions.connection, this.onConnection);
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
    if (!this.queue.includes(jid)) {
      this.queue = this.queue.push(jid);
      this.trigger(this.queue);
    } else {
      Actions.authorize(jid);
    }
  },

  onSendRosterRequest (jid) {
    this.connection.roster.subscribe(jid);
  },

  onAuthorize (jid) {
    this.connection.roster.authorize(jid);
    this.connection.roster.subscribe(jid);

    this.queue = this.queue.delete(this.queue.indexOf(jid));
    this.trigger(this.queue);
  },

  onReject (jid) {
    this.connection.roster.unauthorize(jid);

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
