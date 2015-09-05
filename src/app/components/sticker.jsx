let React  = require('react');
let Reflux = require('reflux');
let moment = require('moment');

let Sticker = React.createClass({
  render () {
    let classes = ["message"];

    if (this.props.message.get('from') === this.props.ownJID) {
      classes.push("belongs-to-self");
    }

    return (
      <div className={classes.join(" ")}>
        <div className="sticker">
          <div className="sticker__image">
            <img src={this.props.message.get('body')} />
          </div>

          <div className="sticker__time">{moment(this.props.message.get('time')).format('HH:mm')}</div>
        </div>
      </div>
    );
  },

});

module.exports = Sticker;
