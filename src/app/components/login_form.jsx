let React   = require('react');
let mui     = require('material-ui');
let Actions = require('../actions');

let TextField    = mui.TextField;
let RaisedButton = mui.RaisedButton;

let LoginForm = React.createClass({

  getInitialState () {
    return {
      jid:      '',
      password: '',
    };
  },

  handleClick (e) {
    Actions.login(this.state.jid, this.state.password);
  },

  handleJidChange (e) {
    this.setState({
      jid: e.target.value,
    });
  },

  handlePasswordChange (e) {
    this.setState({
      password: e.target.value,
    });
  },

  render () {
    return (
      <div className="login-form">
        <div className="input-group">
          <TextField hintText="Jabber ID" value={this.state.jid} onChange={this.handleJidChange} />
        </div>

        <div className="input-group">
          <TextField hintText="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </div>

        <div className="form-actions">
          <RaisedButton label="Login" primary={true} onClick={this.handleClick} />
        </div>
      </div>
    );
  },

});

module.exports = LoginForm;
