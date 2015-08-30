let React = require('react');
let moment = require('moment');

let Message = React.createClass({

  render () {
    return (
      <div className="message">
        <div className="message-bubble">
          <div className="message-bubble__text"><span className="message-bubble__text__inner">{this.props.message.get('body')}</span></div>
          <div className="message-bubble__time">{moment(this.props.message.get('time')).format('HH:mm')}</div>
        </div>
      </div>
    );
  },

});

module.exports = Message;
