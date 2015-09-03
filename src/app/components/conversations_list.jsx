let React       = require('react');
let mui         = require('material-ui');
let Reflux      = require('reflux');
let RosterStore = require('../stores/roster');
let Actions     = require('../actions');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let ToolbarTitle = mui.ToolbarTitle;
let List         = mui.List;
let ListDivider  = mui.ListDivider;
let FontIcon     = mui.FontIcon;
let DropDownIcon = mui.DropDownIcon;
let IconButton   = mui.IconButton;

let RosterItem        = require('./roster_item');
let RosterRequestItem = require('./roster_request_item');
let RosterRequestForm = require('./roster_request_form');
let EditProfileDialog = require('./edit_profile_dialog');

let ConversationsList = React.createClass({
  mixins: [Reflux.connect(RosterStore, "roster")],

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

    let roster = this.state.roster.roster.map(function (u) {
      return <RosterItem key={u.get('jid')} user={u} />;
    });

    let queue = this.state.roster.queue.map(function (u) {
      return <RosterRequestItem key={u} jid={u} />;
    });

    let queueList = '';

    if (this.state.roster.queue.size > 0) {
      queueList = (
        <div>
          <ListDivider />

          <List className="roster-queue" subheader="Contact requests">
            {{queue}}
          </List>
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

        <List className="roster">
          {{roster}}
        </List>

        {{queueList}}

        <div className="pane-bottom">
          <RosterRequestForm />
        </div>

        <EditProfileDialog />
      </div>
    );
  },

});

module.exports = ConversationsList;
