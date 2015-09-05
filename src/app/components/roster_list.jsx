let React       = require('react');
let mui         = require('material-ui');
let RosterStore = require('../stores/roster');
let Reflux      = require('reflux');

let List          = mui.List;
let DocumentTitle = require('react-document-title');
let RosterItem    = require('./roster_item');

let RosterList = React.createClass({
  mixins: [Reflux.connect(RosterStore, 'items')],

  render () {
    let unread = 0;

    let roster = this.state.items.sort(function (a, b) {
      if (a.get('last_activity') === null && b.get('last_activity') === null) {
        return 0;
      }

      if (a.get('last_activity') === null && b.get('last_activity') != null) {
        return 1;
      }

      if (b.get('last_activity') === null && a.get('last_activity') != null) {
        return -1;
      }

      if (moment(a.get('last_activity')).isBefore(b.get('last_activity'))) {
        return 1;
      } else {
        return -1;
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
