let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let moment             = require('moment');
let ConversationsStore = require('../stores/conversations');
let utils              = require('../utils');

let Message = require('./message');

let MessagesList = React.createClass({
  mixins: [
    Reflux.connectFilter(ConversationsStore, "items", function (store) {
      return store.get(this.props.jid, []);
    }),
  ],

  componentWillReceiveProps (nextProps) {
    this.setState({
      items: ConversationsStore.getInitialState().get(nextProps.jid, []),
    });
  },

  componentDidUpdate () {
    let node = React.findDOMNode(this);
    node.scrollTop = node.scrollTopMax;
  },

  render () {
    let ownJID = this.props.ownJID;

    let messages = this.state.items.map(function (m, i, iter) {
      let prev = iter.get(i - 1, null);

      if (i - 1 === -1 || (prev != null && utils.daysDiffer(m, prev))) {
        return (
          <div key={i}>
            <div className="messages__header">{moment(m.get('time')).format('DD.MM.YYYY')}</div>
            <Message message={m} ownJID={ownJID} />
          </div>
        );
      } else {
        return <Message key={i} message={m} ownJID={ownJID} />;
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
