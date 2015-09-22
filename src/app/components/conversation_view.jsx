let React       = require('react');
let mui         = require('material-ui');
let Reflux      = require('reflux');
let RosterStore = require('../stores/roster');
let Actions     = require('../actions');
let utils       = require('../utils');
let moment      = require('moment');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let Avatar       = mui.Avatar;
let FontIcon     = mui.FontIcon;
let CardHeader   = mui.CardHeader;
let Paper        = mui.Paper;
let IconButton   = mui.IconButton;
let IconMenu     = mui.IconMenu;
let MenuItem     = require('material-ui/lib/menus/menu-item');
let MenuDivider  = require('material-ui/lib/menus/menu-divider');
let Colors       = mui.Styles.Colors;

let MessageForm   = require('./message_form');
let MessagesList  = require('./messages_list');
let StickerPicker = require('./sticker_picker');

let ConversationView = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,

    Reflux.connectFilter(RosterStore, "partner", function (store) {
      return store.find(function (item) {
        return item.get('jid') === this.props.jid;
      }.bind(this));
    }),
  ],

  componentWillReceiveProps (nextProps) {
    this.setState({
      partner: RosterStore.getInitialState().find(function (item) {
        return item.get('jid') === nextProps.jid;
      }),
    });
  },

  handleMenuClick (e, item) {
    let value = item._store.props.value;

    if (value === 'remove') {
      Actions.removeFromRoster(this.props.jid);
      Actions.closeChat();
    } else if (value === 'clear') {
      Actions.clearChat(this.props.jid);
    }
  },

  render () {
    let contents = (
      <div className="conversation-view is-empty">
        <img src="/images/welcome.png" className="conversation-view__welcome" />
        <h3 className="conversation-view__welcome-string">XMPP Web</h3>
        <p>This project is open-source and available on <a href="https://github.com/Gargron/xmpp-web" target="_blank">GitHub</a>.</p>
      </div>
    );

    if (!!this.props.jid) {
      let user     = utils.userDisplayData(this.state.partner, this.props.jid);
      let avatar   = <Avatar size={40} backgroundColor={Colors.teal500}>{user.initial}</Avatar>;
      let subtitle = <span dangerouslySetInnerHTML={{__html: user.status === '' ? 'Online' : user.status}} />;

      if (user.photo !== '') {
        avatar = <Avatar size={40} src={user.photo} />;
      }

      if (typeof this.state.partner !== 'undefined' && this.state.partner.get('resources').size === 0 && this.state.partner.get('last_seen') != null) {
        subtitle = 'Last seen ' + moment(this.state.partner.get('last_seen')).fromNow();
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
              <IconMenu onItemTouchTap={this.handleMenuClick} iconButtonElement={<IconButton style={{lineHeight: '56px', paddingLeft: '24px'}}><FontIcon className="material-icons">more_vert</FontIcon></IconButton>}>
                <MenuItem value="clear" primaryText="Clear log" />
                <MenuItem value="remove" primaryText="Remove" />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>

          <MessagesList jid={this.props.jid} ownJID={this.props.ownJID} />

          <div className="pane-bottom">
            <StickerPicker jid={this.props.jid} />
            <MessageForm jid={this.props.jid} />
          </div>
        </div>
      );
    }

    return contents;
  },

});

module.exports = ConversationView;
