let React         = require('react');
let mui           = require('material-ui');
let Reflux        = require('reflux');
let StickersStore = require('../stores/stickers');
let Immutable     = require('immutable');

let FontIcon   = mui.FontIcon;
let IconButton = mui.IconButton;
let Colors     = mui.Styles.Colors;

let StickerItem = require('./sticker_item');

let StickerPickerPopout = React.createClass({
  mixins: [Reflux.connect(StickersStore, 'packs')],

  render () {
    let stickers = this.state.packs.reduce(function (r, val) {
      return r.merge(val.get('items').map(function (item) {
        return {
          org:  val.get('org'),
          pack: val.get('pack'),
          id:   item,
        };
      }));
    }, Immutable.List()).map(function (sticker, i) {
      return <StickerItem key={i} sticker={sticker} jid={this.props.jid} />;
    }, this);

    return (
      <div className="sticker-picker__popout" style={{display: this.props.open ? 'flex' : 'none'}}>
        <div className="sticker-picker__popout__header">
          <div className="popout-tab">
            <FontIcon className="material-icons" color={Colors.grey500}>access_time</FontIcon>
          </div>

          <span className="muted-text">This feature is a work in progress</span>
        </div>

        <div className="sticker-picker__popout__body">
          {stickers}
        </div>
      </div>
    );
  },

});

module.exports = StickerPickerPopout;
