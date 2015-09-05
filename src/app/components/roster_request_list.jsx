let React            = require('react');
let mui              = require('material-ui');
let RosterQueueStore = require('../stores/roster_queue');
let Reflux           = require('reflux');

let List        = mui.List;
let ListDivider = mui.ListDivider;

let RosterRequestItem = require('./roster_request_item');

let RosterRequestList = React.createClass({
  mixins: [Reflux.connect(RosterQueueStore, 'items')],

  render () {
    if (this.state.items.size > 0) {
      let queue = this.state.items.map(function (u) {
        return <RosterRequestItem key={u} jid={u} />;
      });

      return (
        <div>
          <ListDivider />

          <List className="roster-queue" subheader="Contact requests">
            {{queue}}
          </List>
        </div>
      );
    } else {
      return <div />;
    }
  },

});

module.exports = RosterRequestList;
