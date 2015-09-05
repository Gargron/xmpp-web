let React       = require('react');
let mui         = require('material-ui');
let Actions     = require('../actions');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let ToolbarTitle = mui.ToolbarTitle;
let FontIcon     = mui.FontIcon;
let DropDownIcon = mui.DropDownIcon;
let IconButton   = mui.IconButton;

let RosterList        = require('./roster_list');
let RosterRequestList = require('./roster_request_list');
let RosterRequestForm = require('./roster_request_form');
let EditProfileDialog = require('./edit_profile_dialog');

let ConversationsList = React.createClass({
  handleMenuClick (e, key, item) {
    if (item.payload === 'logout') {
      Actions.logout();
    } else if (item.payload === 'profile') {
      Actions.openEditProfileDialog();
    }
  },

  render () {
    let menu = [
      { payload: 'profile', text: 'Profile' },
      { payload: 'logout', text: 'Logout' },
    ];

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
