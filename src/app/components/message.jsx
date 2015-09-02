let React           = require('react');
let Reflux          = require('reflux');
let moment          = require('moment');
let ConnectionStore = require('../stores/connection');

let Message = React.createClass({
  mixins: [Reflux.connect(ConnectionStore, 'connection')],

  render () {
    let classes = ["message"];

    if (this.props.message.get('from') === this.state.connection.connection.jid) {
      classes.push("belongs-to-self");
    }

    return (
      <div className={classes.join(" ")}>
        <div className="message-bubble">
          <div className="message-bubble__text"><span className="message-bubble__text__inner">{this.props.message.get('body')}</span></div>
          <div className="message-bubble__time">{moment(this.props.message.get('time')).format('HH:mm')}</div>
        </div>
      </div>
    );
  },

});

module.exports = Message;
