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

let RosterList        = require('./roster_list');
let RosterRequestList = require('./roster_request_list');
let RosterRequestForm = require('./roster_request_form');
let EditProfileDialog = require('./edit_profile_dialog');

let ConversationsList = React.createClass({
  mixins: [
    Reflux.listenTo(Actions.connectionLost, 'onConnectionLost'),
    Reflux.listenTo(Actions.connection, 'onConnection'),
  ],

  getInitialState () {
    return {
      online: true,
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

    let connectionIndicator = '';

    if (!this.state.online) {
      connectionIndicator = (
        <div>
          <div className="roster-alert">
            No connection
          </div>

          <div className="failure-overlay"></div>
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
            <DropDownIcon menuItems={menu} onChange={this.handleMenuClick} menuItemStyle={{width: '240px'}}>
              <FontIcon className="material-icons" style={{lineHeight: '56px', paddingLeft: '24px'}}>menu</FontIcon>
            </DropDownIcon>
          </ToolbarGroup>
        </Toolbar>

        {connectionIndicator}

        <RosterList />
        <RosterRequestList />

        <div className="pane-bottom">
          <RosterRequestForm />
        </div>

        <EditProfileDialog />
      </div>
    );
  },

});

module.exports = ConversationsList;
