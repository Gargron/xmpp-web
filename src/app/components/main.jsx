let React              = require('react');
let mui                = require('material-ui');
let Reflux             = require('reflux');
let ConversationsStore = require('../stores/conversations');
let Actions            = require('../actions');

let ThemeManager = new mui.Styles.ThemeManager();
let Colors       = mui.Styles.Colors;
let Snackbar     = mui.Snackbar;

let ConversationView  = require('./conversation_view');
let ConversationsList = require('./conversations_list');

let Main = React.createClass({
  mixins: [
    Reflux.listenTo(Actions.connection, "onConnection"),
    Reflux.connect(ConversationsStore, "conversations"),
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
      accent1Color: Colors.deepOrange500,
    });
  },

  onConnection () {
    this.refs.snackbar.show();
  },

  render () {
    return (
      <div className="wrapper">
        <ConversationView jid={this.state.conversations.opened} />
        <ConversationsList />

        <Snackbar ref="snackbar" message="Connection established" autoHideDuration={1000} />
      </div>
    );
  },

});

module.exports = Main;
