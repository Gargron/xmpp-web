let React = require('react');
let mui = require('material-ui');
let Reflux = require('reflux');
let RosterStore = require('../stores/roster');
let ConversationsStore = require('../stores/conversations');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let Avatar       = mui.Avatar;
let FontIcon     = mui.FontIcon;
let CardHeader   = mui.CardHeader;
let Paper        = mui.Paper;

let Message = require('./message');
let MessageForm = require('./message_form');

let ConversationView = React.createClass({
  mixins: [
    Reflux.connectFilter(RosterStore, "partner", function (store) {
      return store.roster.find(function (item) {
        return item.get('jid') === this.props.jid;
      }.bind(this));
    }),

    Reflux.connectFilter(ConversationsStore, "messages", function (store) {
      return store.messages.get(this.props.jid, []);
    }),
  ],

  componentWillReceiveProps (nextProps) {
    this.setState({
      partner: RosterStore.getInitialState().roster.find(function (item) {
        return item.get('jid') === nextProps.jid;
      }),

      messages: ConversationsStore.getInitialState().messages.get(nextProps.jid, []),
    });
  },

  render () {
    let contents = (
      <div className="conversation-view is-empty">
        <Paper zDepth={1} circle={true}>
          <img src="/images/welcome.png" className="conversation-view__welcome" />
        </Paper>

        <h3 className="conversation-view__welcome-string">Welcome back!</h3>
      </div>
    );

    if (!!this.props.jid) {
      let user     = RosterStore.extractDisplayData(this.state.partner, this.props.jid);
      let avatar   = <Avatar size={40}>{user.initial}</Avatar>;
      let subtitle = user.status;

      if (user.photo !== '') {
        avatar = <Avatar size={40} src={user.photo} />;
      }

      if (user.state === 'composing') {
        subtitle = <span>Composing...</span>;
      }

      let messages = this.state.messages.map(function (m) {
        return <Message key={m.get('time')} message={m} />;
      });

      contents = (
        <div className="conversation-view">
          <Toolbar className="header">
            <ToolbarGroup key={0} float="left">
              <CardHeader style={{padding: '8px 0px', marginLeft: '-16px', lineHeight: '20px'}} title={user.name} subtitle={subtitle} avatar={avatar} />
            </ToolbarGroup>

            <ToolbarGroup key={2} float="right">
              <FontIcon className="material-icons">lock</FontIcon>
            </ToolbarGroup>
          </Toolbar>

          <div className="messages">
            {{messages}}
          </div>

          <div className="pane-bottom">
            <MessageForm user={this.props.jid} />
          </div>
        </div>
      );
    }

    return contents;
  },

});

module.exports = ConversationView;
