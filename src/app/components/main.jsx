let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let Actions            = require('../actions');
let ConnectionStore    = require('../stores/connection');

let ThemeManager = new mui.Styles.ThemeManager();
let Colors       = mui.Styles.Colors;
let Snackbar     = mui.Snackbar;

let LoginForm = require('./login_form');
let App       = require('./app');

let Main = React.createClass({
  mixins: [Reflux.connect(ConnectionStore, "connection")],

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

  render () {
    if (this.state.connection.loggedIn) {
      return <App />;
    } else {
      return <LoginForm />;
    }
  },

});

module.exports = Main;
