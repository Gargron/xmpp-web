let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let Actions            = require('../actions');

let ThemeManager = new mui.Styles.ThemeManager();
let Colors       = mui.Styles.Colors;
let Snackbar     = mui.Snackbar;

let LoginForm = require('./login_form');
let App       = require('./app');

let Main = React.createClass({
  mixins: [
    Reflux.listenTo(Actions.login, "onLogin"),
    Reflux.listenTo(Actions.logout, "onLogout"),
  ],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  getInitialState () {
    return {
      loggedIn: localStorage.loggedIn || false,
      jid:      localStorage.jid,
      password: localStorage.password,
    };
  },

  onLogin (jid, password) {
    localStorage.jid      = jid;
    localStorage.password = password; // FIXME
    localStorage.loggedIn = true;

    this.setState({
      jid:      jid,
      password: password,
      loggedIn: true,
    });
  },

  onLogout () {
    localStorage.removeItem('jid');
    localStorage.removeItem('password');
    localStorage.removeItem('loggedIn');

    this.setState({
      jid:      '',
      password: '',
      loggedIn: false,
    });
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.teal500,
    });
  },

  render () {
    if (this.state.loggedIn) {
      return <App jid={this.state.jid} password={this.state.password} />;
    } else {
      return <LoginForm />;
    }
  },

});

module.exports = Main;
