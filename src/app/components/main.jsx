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
  mixins: [Reflux.listenTo(Actions.login, "onLogin")],

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
      loggedIn: false,
    };
  },

  onLogin (jid, password) {
    this.setState({
      jid:      jid,
      password: password,
      loggedIn: true,
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
