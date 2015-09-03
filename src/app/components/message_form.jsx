let React   = require('react');
let Actions = require('../actions');
let mui     = require('material-ui');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;

let MessageForm = React.createClass({

  getInitialState () {
    return {
      body: '',
    };
  },

  handleChange (e) {
    this.setState({
      body: e.target.value,
    });
  },

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this._commitMessage();
    }
  },

  handleClick (e) {
    this._commitMessage();
  },

  _commitMessage () {
    if (this.state.body.length === 0) {
      return;
    }

    Actions.sendMessage(this.props.jid, this.state.body);

    this.setState({
      body: '',
    });
  },

  render () {
    return (
      <div className="message-form form-compact">
        <input type="text" value={this.state.body} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />

        <IconButton iconStyle={{fontSize: '18px'}} style={{width: '42px', height: '42px'}} onClick={this.handleClick}>
          <FontIcon className="material-icons" color={Colors.green500}>send</FontIcon>
        </IconButton>
      </div>
    );
  },

});

module.exports = MessageForm;
