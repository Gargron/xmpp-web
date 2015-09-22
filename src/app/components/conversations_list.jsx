let React       = require('react');
let mui         = require('material-ui');
let Actions     = require('../actions');
let Reflux      = require('reflux');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let ToolbarTitle = mui.ToolbarTitle;
let FontIcon     = mui.FontIcon;
let IconMenu     = mui.IconMenu;
let MenuItem     = require('material-ui/lib/menus/menu-item');
let MenuDivider  = require('material-ui/lib/menus/menu-divider');
let IconButton   = mui.IconButton;
let Colors       = mui.Styles.Colors;

let RosterList          = require('./roster_list');
let RosterRequestList   = require('./roster_request_list');
let RosterRequestForm   = require('./roster_request_form');
let EditProfileDialog   = require('./edit_profile_dialog');
let NotificationsDialog = require('./notifications_dialog');
let PasswordDialog      = require('./password_dialog');

let ConversationsList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Reflux.listenTo(Actions.connectionLost, 'onConnectionLost'),
    Reflux.listenTo(Actions.connection, 'onConnection'),
    Reflux.listenTo(Actions.updateReady, 'onUpdateReady'),
  ],

  getInitialState () {
    return {
      online: true,
      updateReady: window.applicationCache.status === window.applicationCache.UPDATEREADY,
    };
  },

  onConnectionLost () {
    this.setState({
      online: false,
    });
  },

  onConnection () {
    this.setState({
      online: true,
    });
  },

  onUpdateReady () {
    this.setState({
      updateReady: true,
    });
  },

  handleMenuClick (e, item) {
    let value = item._store.props.value;

    if (value === 'logout') {
      Actions.logout();
    } else if (value === 'profile') {
      Actions.openEditProfileDialog();
    } else if (value === 'notifications') {
      Actions.openNotificationsDialog();
    } else if (value === 'password') {
      Actions.openPasswordDialog();
    }
  },

  render () {
    let warnings = '';

    if (!this.state.online) {
      warnings = (
        <div>
          <div className="roster-alert critical">
            <FontIcon className="material-icons" color={Colors.amberA200} style={{fontSize: '35px', padding: '5px'}}>wifi</FontIcon>

            <div>
              <strong>No connection</strong>
              <span>Will try reconnecting every 5 seconds...</span>
            </div>
          </div>

          <div className="failure-overlay"></div>
        </div>
      );
    } else if (this.state.updateReady) {
      warnings = (
        <div className="roster-alert info">
          <FontIcon className="material-icons" color={Colors.teal200} style={{fontSize: '35px', padding: '5px'}}>cached</FontIcon>

          <div>
            <strong>Update available</strong>
            <span>Refresh the page for it to take effect</span>
          </div>
        </div>
      );
    }

    return (
      <div className="conversations-list">
        <Toolbar className="header">
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Contacts" />
          </ToolbarGroup>

          <ToolbarGroup key={1} float="right">
            <IconMenu onItemTouchTap={this.handleMenuClick} iconButtonElement={<IconButton style={{lineHeight: '56px', paddingLeft: '24px'}}><FontIcon className="material-icons">menu</FontIcon></IconButton>}>
              <MenuItem value="profile" primaryText="Profile &amp; Status" />
              <MenuItem value="notifications" primaryText="Notifications" />
              <MenuDivider />
              <MenuItem value="logout" primaryText="Logout" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>

        {warnings}

        <RosterList />
        <RosterRequestList />

        <div className="pane-bottom">
          <RosterRequestForm />
        </div>

        <EditProfileDialog />
        <NotificationsDialog />
        <PasswordDialog />
      </div>
    );
  },

});

module.exports = ConversationsList;
