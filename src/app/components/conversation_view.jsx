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
      let user   = RosterStore.extractDisplayData(this.state.partner, this.props.jid);
      let avatar = <Avatar size={40}>{user.initial}</Avatar>;

      if (user.photo !== '') {
        avatar = <Avatar size={40} src={user.photo} />;
      }

      let messages = this.state.messages.map(function (m) {
        return <Message key={m.get('id')} message={m} />;
      });

      contents = (
        <div className="conversation-view">
          <Toolbar className="header">
            <ToolbarGroup key={0} float="left">
              <CardHeader style={{'padding': '8px 0px', 'margin-left': '-16px', 'line-height': '20px'}} title={user.name} subtitle={user.status} avatar={avatar} />
            </ToolbarGroup>

            <ToolbarGroup key={2} float="right">
              <FontIcon className="material-icons">lock</FontIcon>
            </ToolbarGroup>
          </Toolbar>

          <div className="messages">
            {{messages}}
          </div>
        </div>
      );
    }

    return contents;
  },

});

module.exports = ConversationView;
