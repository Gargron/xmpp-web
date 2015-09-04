let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let Actions            = require('../actions');
let ConnectionStore    = require('../stores/connection');

let ThemeManager     = new mui.Styles.ThemeManager();
let Colors           = mui.Styles.Colors;
let CircularProgress = mui.CircularProgress;
let Snackbar         = mui.Snackbar;

let LoginForm = require('./login_form');
let App       = require('./app');

let Main = React.createClass({
  mixins: [
    Reflux.listenTo(Actions.login, "onLogin"),
    Reflux.listenTo(Actions.logout, "onLogout"),
    Reflux.listenTo(Actions.connection, "onConnection"),
    Reflux.listenTo(Actions.connectionLost, "onConnectionLost"),
    Reflux.listenTo(Actions.loginFailed, "onLoginFailed"),
    Reflux.listenTo(Actions.messageReceived, "onMessageReceived"),
  ],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.teal500,
    });
  },

  getInitialState () {
    return {
      loggedIn: false,
      loading:  false,
      ownJID:   null,
    };
  },

  onLogin () {
    this.setState({
      loggedIn: true,
      loading:  true,
    });
  },

  onConnection (connection) {
    this.setState({
      loading: false,
      ownJID:  Strophe.getBareJidFromJid(connection.jid),
    });

    this.refs.sbConnectionEstablished.show();
  },

  onLogout () {
    this.setState({
      loggedIn: false,
      loading: false,
    });
  },

  onMessageReceived (stanza) {
    if (stanza.querySelectorAll('body').length === 0) {
      return;
    }

    if (typeof Audio === 'undefined') {
      return;
    }

    let audio = new Audio('/sounds/notification_message.mp3');
    audio.play();
  },

  onConnectionLost () {
    this.refs.sbConnectionLost.show();
  },

  onLoginFailed () {
    this.setState({
      loading:  false,
      loggedIn: false,
    });

    this.refs.sbLoginFailed.show();
  },

  render () {
    let content;

    if (this.state.loading) {
      content = <CircularProgress mode="indeterminate" size={2} />;
    } else if (this.state.loggedIn) {
      content = <App ownJID={this.state.ownJID} />;
    } else {
      content = <LoginForm />;
    }

    return (
      <div className="wrapper__outer">
        {content}

        <Snackbar ref="sbConnectionEstablished" message="Connection established" autoHideDuration={2000} />
        <Snackbar ref="sbConnectionLost" message="Connection lost" />
        <Snackbar ref="sbLoginFailed" message="Login failed" action="Correct login details" onActionTouchTap={Actions.logout} />
      </div>
    );
  },

});

module.exports = Main;
