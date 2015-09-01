let React = require('react');
let mui   = require('material-ui');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;

let RosterRequestForm = React.createClass({

  render () {
    return (
      <div className='roster-request-form form-compact'>
        <input type="text" placeholder="Enter jabber ID" />

        <IconButton iconStyle={{fontSize: '18px'}} style={{width: '42px', height: '42px'}}>
          <FontIcon className="material-icons" color={Colors.teal500}>person_add</FontIcon>
        </IconButton>
      </div>
    );
  },

});

module.exports = RosterRequestForm;
