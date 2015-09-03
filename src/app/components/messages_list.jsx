let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let ConversationsStore = require('../stores/conversations');

let Message = require('./message');

let MessagesList = React.createClass({
  mixins: [
    Reflux.connectFilter(ConversationsStore, "messages", function (store) {
      return store.messages.get(this.props.jid, []);
    }),
  ],

  componentWillReceiveProps (nextProps) {
    this.setState({
      messages: ConversationsStore.getInitialState().messages.get(nextProps.jid, []),
    });
  },

  componentDidUpdate () {
    let node = React.findDOMNode(this);
    node.scrollTop = node.scrollTopMax;
  },

  render () {
    let messages = this.state.messages.map(function (m, i) {
      return <Message key={i} message={m} />;
    });

    return (
      <div className="messages">
        <div className="messages__space"></div>

        {{messages}}
      </div>
    );
  },

});

module.exports = MessagesList;
