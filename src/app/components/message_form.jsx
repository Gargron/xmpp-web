let React   = require('react');
let Actions = require('../actions');
let mui     = require('material-ui');
let utils   = require('../utils');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;

let MessageForm = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState () {
    return {
      body:        '',
      idleSeconds: 0,
      typing:      false,
    };
  },

  componentDidMount () {
    this.everySecond = setInterval(function () {
      let newIdleSeconds = this.state.idleSeconds + 1;
      let newTyping      = this.state.typing;

      if (newTyping && newIdleSeconds > 4) {
        newTyping = false;
        Actions.sendStateChange(this.props.jid, 'active');
      }

      this.setState({
        idleSeconds: newIdleSeconds,
        typing:      newTyping,
      });
    }.bind(this), 1000);
  },

  componentWillUnmount () {
    clearInterval(this.everySecond);
  },

  handleChange (e) {
    this.setState({
      body: e.target.value,
    });
  },

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this._commitMessage();
    } else {
      let newTyping = this.state.typing;
      let newIdleSeconds;

      if (!newTyping) {
        newTyping = true;
        Actions.sendStateChange(this.props.jid, 'composing');
        Actions.resetUnreadCounter(this.props.jid);
      }

      newIdleSeconds = 0;

      this.setState({
        idleSeconds: newIdleSeconds,
        typing:      newTyping,
      });
    }
  },

  handleClick (e) {
    this._commitMessage();
  },

  handleBodyClick (e) {
    Actions.resetUnreadCounter(this.props.jid);
  },

  _commitMessage () {
    if (this.state.body.length === 0) {
      return;
    }

    Actions.sendMessage(this.props.jid, this.state.body, 'text');

    this.setState({
      body: '',
    });
  },

  render () {
    return (
      <div className="message-form form-compact">
        <input type="text" value={this.state.body} onChange={this.handleChange} onKeyUp={this.handleKeyUp} onClick={this.handleBodyClick} />

        <IconButton iconStyle={{fontSize: '18px'}} style={{width: '42px', height: '42px'}} onClick={this.handleClick}>
          <FontIcon className="material-icons" color={Colors.green500}>send</FontIcon>
        </IconButton>
      </div>
    );
  },

});

module.exports = MessageForm;
