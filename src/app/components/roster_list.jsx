let React       = require('react');
let mui         = require('material-ui');
let RosterStore = require('../stores/roster');
let Reflux      = require('reflux');
let moment      = require('moment');

let List          = mui.List;
let DocumentTitle = require('react-document-title');
let RosterItem    = require('./roster_item');

let RosterList = React.createClass({
  mixins: [Reflux.connect(RosterStore, 'items')],

  render () {
    let unread = 0;

    let roster = this.state.items.sort(function (a, b) {
      // 1. Sort by last_activity
      // 2. Sort by who was last_seen online
      // 3. Sort by who's online

      let a_last   = a.get('last_activity', a.get('last_seen', null));
      let b_last   = b.get('last_activity', b.get('last_seen', null));
      let a_online = a.get('resources').size > 0;
      let b_online = b.get('resources').size > 0;

      if (a_last === null && b_last === null) {
        if (a_online && !b_online) {
          return -1;
        } else if (b_online && !a_online) {
          return 1;
        } else {
          return 0;
        }
      }

      if (a_last === null && b_last != null) {
        return 1;
      }

      if (b_last === null && a_last != null) {
        return -1;
      }

      if (moment(a_last).isBefore(b_last)) {
        return 1;
      } else if (moment(b_last).isBefore(a_last)) {
        return -1;
      } else {
        return 0;
      }
    }).map(function (u) {
      unread = unread + u.get('unread');
      return <RosterItem key={u.get('jid')} user={u} />;
    });

    if (unread === 0) {
      unread = 'XMPP Web';
    } else {
      unread = '(' + unread + ') XMPP Web';
    }

    return (
      <DocumentTitle title={unread}>
        <List className="roster">
          {{roster}}
        </List>
      </DocumentTitle>
    );
  },

});

module.exports = RosterList;
