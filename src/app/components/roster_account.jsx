let React           = require('react');
let mui             = require('material-ui');
let Reflux          = require('reflux');
let ConnectionStore = require('../stores/connection');
let Actions         = require('../actions');

let ListItem   = mui.ListItem;
let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;
let Avatar     = mui.Avatar;
let Dialog     = mui.Dialog;

let RosterAccount = React.createClass({
  mixins: [Reflux.connect(ConnectionStore, 'connection')],

  handleClick () {
    this.refs.dialog.show();
  },

  render () {
    let settingsButton = (
      <IconButton onClick={this.handleClick}>
        <FontIcon className="material-icons" color={Colors.grey500}>settings</FontIcon>
      </IconButton>
    );

    let nickname = this.state.connection.account.get('nickname');
    let photo    = this.state.connection.account.get('photo');
    let status   = this.state.connection.account.get('status');
    let avatar;

    if (nickname === '') {
      nickname = this.state.connection.jid;
    }

    if (photo === '') {
      avatar = <Avatar icon={<FontIcon className="material-icons">image</FontIcon>} />;
    } else {
      avatar = <Avatar src={photo} />;
    }

    let dialogActions = [
      { text: 'Cancel' },
      { text: 'Submit', ref: 'submit' },
    ];

    return (
      <div>
        <Dialog title="Update profile" ref="dialog" actions={dialogActions} actionFocus="submit">
          TODO
        </Dialog>

        <ListItem leftAvatar={avatar} disabled={true} primaryText={nickname} secondaryText={status} rightIconButton={settingsButton} />
      </div>
    );
  },

});

module.exports = RosterAccount;
