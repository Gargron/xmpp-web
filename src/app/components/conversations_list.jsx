let React       = require('react');
let mui         = require('material-ui');
let Actions     = require('../actions');
let Reflux      = require('reflux');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let ToolbarTitle = mui.ToolbarTitle;
let FontIcon     = mui.FontIcon;
let DropDownIcon = mui.DropDownIcon;
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

  handleMenuClick (e, key, item) {
    if (item.payload === 'logout') {
      Actions.logout();
    } else if (item.payload === 'profile') {
      Actions.openEditProfileDialog();
    } else if (item.payload === 'notifications') {
      Actions.openNotificationsDialog();
    } else if (item.payload === 'password') {
      Actions.openPasswordDialog();
    }
  },

  render () {
    let menu = [
      { payload: 'profile', text: 'Profile' },
      { payload: 'notifications', text: 'Notifications' },
      { payload: 'password', text: 'Change password' },
      { payload: 'logout', text: 'Logout' },
    ];

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
            <DropDownIcon menuItems={menu} onChange={this.handleMenuClick} className="dropdown-menu">
              <FontIcon className="material-icons" style={{lineHeight: '56px', paddingLeft: '24px'}}>menu</FontIcon>
            </DropDownIcon>
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
