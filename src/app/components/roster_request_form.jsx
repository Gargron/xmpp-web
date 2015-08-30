let React = require('react');
let mui   = require('material-ui');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;

let RosterRequestForm = React.createClass({

  render () {
    return (
      <div className='roster-request-form'>
        <input type="text" placeholder="Enter the Jabber ID" />

        <IconButton iconStyle={{'font-size': '18px'}} style={{'width': '42px', 'height': '42px'}}>
          <FontIcon className="material-icons">person_add</FontIcon>
        </IconButton>
      </div>
    );
  },

});

module.exports = RosterRequestForm;
