let React       = require('react');
let mui         = require('material-ui');
let RosterStore = require('../stores/roster');
let Reflux      = require('reflux');

let List       = mui.List;
let RosterItem = require('./roster_item');

let RosterList = React.createClass({
  mixins: [Reflux.connect(RosterStore, 'items')],

  render () {
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
      return <RosterItem key={u.get('jid')} user={u} />;
    });

    return (
      <List className="roster">
        {{roster}}
      </List>
    );
  },

});

module.exports = RosterList;
