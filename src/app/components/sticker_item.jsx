let React   = require('react');
let Actions = require('../actions');

let StickerItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  handleClick (e) {
    Actions.sendMessage(this.props.jid, this.props.sticker, 'sticker');
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
