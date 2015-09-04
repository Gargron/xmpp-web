let React       = require('react');
let mui         = require('material-ui');
let RosterStore = require('../stores/roster');
let Actions     = require('../actions');

let ListItem = mui.ListItem;
let Avatar   = mui.Avatar;

let RosterItem = React.createClass({

  render () {
    let user   = RosterStore.extractDisplayData(this.props.user);
    let avatar = <Avatar>{user.initial}</Avatar>;
    let status = user.status;

    if (user.photo !== '') {
      avatar = <Avatar src={user.photo} />;
    }

    if (this.props.user.get('unread') > 0) {
      avatar = (
        <div className='unread-counter'>
          {avatar}
          <div className='unread-counter__inner'>{this.props.user.get('unread')}</div>
        </div>
      );
    }

    if (status === '') {
      status = 'Online';
    }

    return (
      <ListItem leftAvatar={avatar} primaryText={user.name} secondaryText={status} onClick={Actions.openChat.bind(this, user.jid)}/>
    );
  },

});

module.exports = RosterItem;
