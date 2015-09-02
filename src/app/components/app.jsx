let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let ConversationsStore = require('../stores/conversations');
let Actions            = require('../actions');

let Snackbar = mui.Snackbar;

let ConversationView  = require('./conversation_view');
let ConversationsList = require('./conversations_list');

let App = React.createClass({
  mixins: [
    Reflux.listenTo(Actions.connection, "onConnection"),
    Reflux.listenTo(Actions.connectionLost, "onConnectionLost"),
    Reflux.listenTo(Actions.loginFailed, "onLoginFailed"),
    Reflux.connect(ConversationsStore, "conversations"),
  ],

  onConnection () {
    this.refs.sbConnectionEstablished.show();
  },

  onConnectionLost () {
    this.refs.sbConnectionLost.show();
  },

  onLoginFailed () {
    this.refs.sbLoginFailed.show();
  },

  render () {
    return (
      <div className="wrapper">
        <ConversationView jid={this.state.conversations.opened} />
        <ConversationsList />

        <Snackbar ref="sbConnectionEstablished" message="Connection established" autoHideDuration={2000} />
        <Snackbar ref="sbConnectionLost" message="Connection lost" />
        <Snackbar ref="sbLoginFailed" message="Login failed" action="Correct login details" onActionTouchTap={Actions.logout} />
      </div>
    );
  },

});

module.exports = App;
