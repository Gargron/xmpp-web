let React       = require('react');
let mui         = require('material-ui');
let RosterStore = require('../stores/roster');
let Reflux      = require('reflux');

let List       = mui.List;
let RosterItem = require('./roster_item');

let RosterList = React.createClass({
  mixins: [Reflux.connect(RosterStore, 'items')],

  render () {
    let roster = this.state.items.map(function (u) {
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
