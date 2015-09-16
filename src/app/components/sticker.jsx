let React  = require('react');
let mui    = require('material-ui');
let Reflux = require('reflux');
let moment = require('moment');

let Colors   = mui.Styles.Colors;
let FontIcon = mui.FontIcon;

let Sticker = React.createClass({
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

    let uid = message.get('body');
    let url = '/images/stickers/' + uid.split('.').join('/') + '.png';

    return (
      <div className={classes.join(" ")}>
        <div className="sticker">
          <div className="sticker__image">
            <img src={url} width="128" height="128" />
          </div>

          <div className="sticker__time">
            {status}
            {moment(message.get('time')).format('HH:mm')}
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Sticker;
