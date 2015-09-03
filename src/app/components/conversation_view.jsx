let React       = require('react');
let mui         = require('material-ui');
let Reflux      = require('reflux');
let RosterStore = require('../stores/roster');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let Avatar       = mui.Avatar;
let FontIcon     = mui.FontIcon;
let CardHeader   = mui.CardHeader;
let Paper        = mui.Paper;
let IconButton   = mui.IconButton;

let MessageForm  = require('./message_form');
let MessagesList = require('./messages_list');

let ConversationView = React.createClass({
  mixins: [
    Reflux.connectFilter(RosterStore, "partner", function (store) {
      return store.roster.find(function (item) {
        return item.get('jid') === this.props.jid;
      }.bind(this));
    }),
  ],

  componentWillReceiveProps (nextProps) {
    this.setState({
      partner: RosterStore.getInitialState().roster.find(function (item) {
        return item.get('jid') === nextProps.jid;
      }),
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

      contents = (
        <div className="conversation-view">
          <Toolbar className="header">
            <ToolbarGroup key={0} float="left">
              <CardHeader style={{padding: '8px 0px', marginLeft: '-16px', lineHeight: '20px'}} title={user.name} subtitle={subtitle} avatar={avatar} />
            </ToolbarGroup>

            <ToolbarGroup key={2} float="right">
              <IconButton tooltip="No end-to-end encryption" style={{lineHeight: '56px', paddingLeft: '24px'}}>
                <FontIcon className="material-icons">lock_open</FontIcon>
              </IconButton>
            </ToolbarGroup>
          </Toolbar>

          <MessagesList jid={this.props.jid} />

          <div className="pane-bottom">
            <MessageForm jid={this.props.jid} />
          </div>
        </div>
      );
    }

    return contents;
  },

});

module.exports = ConversationView;
