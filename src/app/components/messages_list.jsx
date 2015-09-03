let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let moment             = require('moment');
let ConversationsStore = require('../stores/conversations');

let Message = require('./message');

let daysDiffer = function (a, b) {
  return !moment(a.get('time')).isSame(b.get('time'), 'day');
};

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
    let messages = this.state.messages.map(function (m, i, iter) {
      let prev = iter.get(i - 1, null);

      if (i - 1 === -1 || (prev != null && daysDiffer(m, prev))) {
        return (
          <div key={i}>
            <div className="messages__header">{moment(m.get('time')).format('DD.MM.YYYY')}</div>
            <Message message={m} />
          </div>
        );
      } else {
        return <Message key={i} message={m} />;
      }
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
