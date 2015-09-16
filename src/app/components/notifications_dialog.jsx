let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let Actions            = require('../actions');
let NotificationsStore = require('../stores/notifications');

let Colors = mui.Styles.Colors;
let Dialog = mui.Dialog;
let Toggle = mui.Toggle;

let NotificationsDialog = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Reflux.connect(NotificationsStore, 'notifications'),
    Reflux.listenTo(Actions.openNotificationsDialog, 'onOpenNotificationsDialog'),
  ],

  onOpenNotificationsDialog () {
    this.refs.dialog.show();
  },

  handleToggle (e, val) {
    if (val === true && this.state.permission !== 'granted') {
      Notification.requestPermission(function (permission) {
        this.setState({
          permission: permission,
          enabled:    permission === 'granted',
        });

        this.refs.toggleEnabled.setToggled(permission === 'granted');
      }.bind(this));
    } else {
      this.setState({
        enabled: val,
      });
    }
  },

  render () {
    return (
      <Dialog ref="dialog" actions={[{ text: 'Close', ref: 'close' }]} actionFocus="close" contentClassName="notifications-dialog">
        <Toggle ref="toggleEnabled" checked={this.state.notifications.get('enabled')} label="Desktop notifications" onToggle={Actions.toggleNotificationsSetting} />
        <Toggle ref="toggleSounds" checked={this.state.notifications.get('sounds')} label="Sounds" onToggle={Actions.toggleSoundsSetting} />
      </Dialog>
    );
  },

});

module.exports = NotificationsDialog;
