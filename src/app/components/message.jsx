let React   = require('react');
let mui     = require('material-ui');
let Reflux  = require('reflux');
let moment  = require('moment');
let emoji   = require('emoji');
let linkify = require('linkifyjs/string');
let utils   = require('../utils');

let Colors   = mui.Styles.Colors;
let FontIcon = mui.FontIcon;

let Message = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render () {
    let message = this.props.message;
    let classes = ["message"];
    let status  = "";

    if (message.get('from') === this.props.ownJID) {
      classes.push("belongs-to-self");

      if (message.get('status') === 'received') {
        status = 'done';
      } else if (message.get('status') === 'displayed') {
        status = 'done_all';
      }

      status = <FontIcon className="material-icons" color={Colors.teal500} style={{fontSize: '12px', lineHeight: '14px', marginRight: '2px', bottom: '-2px'}}>{status}</FontIcon>;
    }

    let body = message.get('body');
    body     = linkify(body);
    body     = emoji.unifiedToHTML(body);

    return (
      <div className={classes.join(" ")}>
        <div className="message-bubble">
          <div className="message-bubble__text"><span className="message-bubble__text__inner" dangerouslySetInnerHTML={{__html: body}}></span></div>

          <div className="message-bubble__time">
            {status}
            {moment(message.get('time')).format('HH:mm')}
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Message;
