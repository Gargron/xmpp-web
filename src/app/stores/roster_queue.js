let Reflux      = require('reflux');
let Actions     = require('../actions.js');
let Immutable   = require('immutable');
let RosterStore = require('./roster');

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
    let haveInContacts = RosterStore.getInitialState().findIndex(function (val) {
      return val.get('jid') === jid;
    });

    if (haveInContacts === -1) {
      console.log('Roster request received, do not have in contacts');
      this.queue = this.queue.push(jid);
      this.trigger(this.queue);
    } else {
      console.log('Roster request received, have in contacts, authorizing automatically');
      Actions.authorize(jid);
    }
  },

  onSendRosterRequest (jid) {
    console.log('Sending roster request to ' + jid);

    this.connection.roster.add(jid, "", []);
    this.connection.roster.subscribe(jid);
  },

  onAuthorize (jid) {
    console.log('Authorizing ' + jid);

    this.connection.roster.authorize(jid);
    this.connection.roster.subscribe(jid);

    this.queue = this.queue.delete(this.queue.indexOf(jid));
    this.trigger(this.queue);
  },

  onReject (jid) {
    console.log('Rejecting ' + jid);
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
