let React   = require('react');
let mui     = require('material-ui');
let Actions = require('../actions');

let ListItem = mui.ListItem;
let Colors   = mui.Styles.Colors;
let FontIcon = mui.FontIcon;

let RosterRequestItem = React.createClass({

  render () {
    return (
      <ListItem
        leftIcon={<FontIcon className="material-icons" color={Colors.teal500}>person_add</FontIcon>}
        primaryText={this.props.jid}
        secondaryText="Authorize or reject"
        rightIconButton={<FontIcon className="material-icons" style={{padding: '12px'}}>more_vert</FontIcon>}
        onClick={Actions.openChat.bind(this, this.props.jid)} />
    );
  },

});

module.exports = RosterRequestItem;
