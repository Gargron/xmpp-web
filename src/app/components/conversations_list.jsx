let React       = require('react');
let mui         = require('material-ui');
let Reflux      = require('reflux');
let RosterStore = require('../stores/roster');

let Toolbar      = mui.Toolbar;
let ToolbarGroup = mui.ToolbarGroup;
let ToolbarTitle = mui.ToolbarTitle;
let List         = mui.List;
let ListDivider  = mui.ListDivider;
let FontIcon     = mui.FontIcon;
let DropDownIcon = mui.DropDownIcon;

let RosterItem        = require('./roster_item');
let RosterRequestItem = require('./roster_request_item');
let RosterRequestForm = require('./roster_request_form');

let ConversationsList = React.createClass({
  mixins: [Reflux.connect(RosterStore, "roster")],

  render () {
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
            <ToolbarTitle text="Account" />
          </ToolbarGroup>

          <ToolbarGroup key={1} float="right">
            <DropDownIcon menuItems={[{payload: '1', text: 'Test'}]}>
              <FontIcon className="material-icons" style={{'line-height': '56px', 'padding-left': '24px'}}>menu</FontIcon>
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
      </div>
    );
  },

});

module.exports = ConversationsList;
