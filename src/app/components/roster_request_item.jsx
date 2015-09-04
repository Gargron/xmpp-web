let React   = require('react');
let mui     = require('material-ui');
let Actions = require('../actions');

let ListItem     = mui.ListItem;
let Colors       = mui.Styles.Colors;
let FontIcon     = mui.FontIcon;
let DropDownIcon = mui.DropDownIcon;

let RosterRequestItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  handleMenuClick (e, key, data) {
    if (data.payload === 'authorize') {
      Actions.authorize(this.props.jid);
    } else if (data.payload === 'reject') {
      Actions.reject(this.props.jid);
    }
  },

  render () {
    let menu = [
      { payload: 'authorize', text: 'Authorize' },
      { payload: 'reject', text: 'Reject' },
    ];

    let dropdownMenu = (
      <DropDownIcon menuItems={menu} onChange={this.handleMenuClick}>
        <FontIcon className="material-icons" style={{padding: '12px'}}>more_vert</FontIcon>
      </DropDownIcon>
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
