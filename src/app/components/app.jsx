let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let ConversationsStore = require('../stores/conversations');
let Actions            = require('../actions');

let ConversationView  = require('./conversation_view');
let ConversationsList = require('./conversations_list');

let App = React.createClass({
  mixins: [
    Reflux.listenTo(Actions.openChat, "onOpenChat"),
    Reflux.listenTo(Actions.closeChat, "onCloseChat"),
  ],

  getInitialState () {
    return {
      openedJID: false,
    };
  },

  onOpenChat (jid) {
    this.setState({
      openedJID: jid,
    });
  },

  onCloseChat () {
    this.setState({
      openedJID: false,
    });
  },

  render () {
    return (
      <div className="wrapper">
        <ConversationView jid={this.state.openedJID} ownJID={this.props.ownJID} />
        <ConversationsList />
      </div>
    );
  },

});

module.exports = App;
