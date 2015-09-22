let React   = require('react');
let mui     = require('material-ui');
let Actions = require('../actions');

let ListItem     = mui.ListItem;
let Colors       = mui.Styles.Colors;
let FontIcon     = mui.FontIcon;
let IconMenu     = mui.IconMenu;
let IconButton   = mui.IconButton;
let MenuItem     = require('material-ui/lib/menus/menu-item');
let MenuDivider  = require('material-ui/lib/menus/menu-divider');

let RosterRequestItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  handleMenuClick (e, item) {
    let value = item._store.props.value;

    if (value === 'authorize') {
      Actions.authorize(this.props.jid);
    } else if (value === 'reject') {
      Actions.reject(this.props.jid);
    }
  },

  render () {
    let dropdownMenu = (
      <IconMenu onItemTouchTap={this.handleMenuClick} iconButtonElement={<IconButton style={{padding: '12px'}}><FontIcon className="material-icons">more_vert</FontIcon></IconButton>}>
        <MenuItem value="authorize" primaryText="Authorize" />
        <MenuItem value="reject" primaryText="Reject" />
      </IconMenu>
    );

    return (
      <ListItem
        leftIcon={<FontIcon className="material-icons" color={Colors.teal500}>person_add</FontIcon>}
        primaryText={this.props.jid}
        secondaryText="Authorize or reject"
        rightIconButton={dropdownMenu}
        onClick={Actions.openChat.bind(this, this.props.jid)} />
    );
  },

});

module.exports = RosterRequestItem;
