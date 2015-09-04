let React   = require('react');
let mui     = require('material-ui');
let Actions = require('../actions');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;

let RosterRequestForm = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState () {
    return {
      jid: '',
    };
  },

  handleChange (e) {
    this.setState({
      jid: e.target.value,
    });
  },

  handleClick () {
    this._submit();
  },

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this._submit();
    }
  },

  _submit () {
    if (this.state.jid.length > 0) {
      Actions.sendRosterRequest(this.state.jid);
      this.setState({ jid: '' });
    }
  },

  render () {
    return (
      <div className='roster-request-form form-compact'>
        <input type="text" placeholder="Enter jabber ID" value={this.state.jid} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />

        <IconButton iconStyle={{fontSize: '18px'}} style={{width: '42px', height: '42px'}} onClick={this.handleClick}>
          <FontIcon className="material-icons" color={Colors.teal500}>person_add</FontIcon>
        </IconButton>
      </div>
    );
  },

});

module.exports = RosterRequestForm;
