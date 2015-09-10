let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let moment             = require('moment');
let ConversationsStore = require('../stores/conversations');
let utils              = require('../utils');
let Actions            = require('../actions.js');
let Immutable          = require('immutable');

let Message = require('./message');
let Sticker = require('./sticker');

let MessagesList = React.createClass({
  mixins: [Reflux.listenTo(ConversationsStore, "onConversationsStore")],

  onConversationsStore (store) {
    this.setState({
      items: store.get(this.props.jid, Immutable.List()),
    });
  },

  getInitialState () {
    return {
      items: ConversationsStore.getInitialState().get(this.props.jid, Immutable.List()),
    };
  },

  componentWillReceiveProps (nextProps) {
    this.setState({
      items: ConversationsStore.getInitialState().get(nextProps.jid, Immutable.List()),
    });
  },

  componentWillUpdate () {
    let node = React.findDOMNode(this);
    this.shouldScrollBottom = node.scrollHeight - node.scrollTop === node.clientHeight;

    let ownJID = this.props.ownJID;

    let lastForeignMessage = this.state.items.findLast(function (val) {
      return val.get('from') !== ownJID && val.get('status') !== 'displayed';
    });

    if (lastForeignMessage) {
      Actions.markMessage.triggerAsync(lastForeignMessage.get('from'), lastForeignMessage.get('id'), 'displayed');
    }
  },

  componentDidUpdate () {
    if (this.shouldScrollBottom === false) {
      return;
    }

    let node = React.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  },

  render () {
    let ownJID = this.props.ownJID;

    let messages = this.state.items.map(function (m, i, iter) {
      let prev = iter.get(i - 1, null);
      let tag;

      if (m.get('type', 'text') === 'text') {
        tag = <Message key={i} message={m} ownJID={ownJID} />;
      } else if (m.get('type', 'text') === 'sticker') {
        tag = <Sticker key={i} message={m} ownJID={ownJID} />;
      }

      if (i - 1 === -1 || (prev != null && utils.daysDiffer(m, prev))) {
        return (
          <div key={i}>
            <div className="messages__header">{moment(m.get('time')).format('DD.MM.YYYY')}</div>
            {tag}
          </div>
        );
      } else {
        return tag;
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
