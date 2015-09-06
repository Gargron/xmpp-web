let React       = require('react');
let mui         = require('material-ui');
let RosterStore = require('../stores/roster');
let Actions     = require('../actions');
let utils       = require('../utils');

let ListItem = mui.ListItem;
let Avatar   = mui.Avatar;
let Colors   = mui.Styles.Colors;

let RosterItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render () {
    let user   = utils.userDisplayData(this.props.user);
    let avatar = <Avatar backgroundColor={Colors.teal500}>{user.initial}</Avatar>;
    let status = user.status;
    let unread = '';
    let online = '';

    if (user.photo !== '') {
      avatar = <Avatar src={user.photo} />;
    }

    if (this.props.user.get('unread') > 0) {
      unread = <div className='unread-counter'>{this.props.user.get('unread')}</div>;
    }

    if (status === '') {
      status = 'Online';
    }

    if (this.props.user.get('resources').size > 0) {
      online = <div className="online-indicator" />;
    }

    let avatarContainer = (
      <div className="avatar-container">
        {unread}
        {avatar}
        {online}
      </div>
    );

    return (
      <ListItem leftAvatar={avatarContainer} primaryText={user.name} secondaryText={<span dangerouslySetInnerHTML={{__html: status}} />} onClick={Actions.openChat.bind(this, user.jid)}/>
    );
  },

});

module.exports = RosterItem;
