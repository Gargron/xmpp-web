let React   = require('react');
let Actions = require('../actions');

let StickerItem = React.createClass({

  handleClick (e) {
    Actions.sendSticker(this.props.jid, this.props.sticker);
  },

  render () {
    let sticker = this.props.sticker;
    let url     = '/images/stickers/' + sticker.org + '/' + sticker.pack + '/' + sticker.id + '.png';

    return (
      <button onClick={this.handleClick} className="sticker-thumbnail">
        <img src={url} />
      </button>
    );
  },

});

module.exports = StickerItem;
