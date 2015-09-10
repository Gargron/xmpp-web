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

  getInitialState () {
    return {
      pack: false,
    };
  },

  handleTabClick (index, e) {
    this.setState({
      pack: index,
    });
  },

  render () {
    let packTabs = this.state.packs.map(function (pack, i) {
      let thumbUrl = '/images/stickers/' + pack.get('org') + '/' + pack.get('pack') + '/thumb.png';

      return (
        <IconButton className="popout-tab" onClick={this.handleTabClick.bind(this, i)} tooltip={pack.getIn(['meta', 'name'])} tooltipPosition="top-center" style={{width: '35px', height: '35px'}}>
          <img src={thumbUrl} />
        </IconButton>
      );
    }, this);

    let stickers;

    if (this.state.pack === false) {
      // Display last used stickers
      stickers = this.state.packs.reduce(function (r, val) {
        return r.concat(val.get('items').map(function (item) {
          return {
            org:  val.get('org'),
            pack: val.get('pack'),
            id:   item,
          };
        }));
      }, Immutable.List());
    } else {
      let pack = this.state.packs.get(this.state.pack);

      stickers = pack.get('items').map(function (item) {
        return {
          org:  pack.get('org'),
          pack: pack.get('pack'),
          id:   item,
        };
      });
    }

    stickers = stickers.map(function (sticker) {
      let key = [sticker.org, sticker.pack, sticker.id].join('.');
      return <StickerItem key={key} sticker={sticker} jid={this.props.jid} />;
    }, this);

    return (
      <div className="sticker-picker__popout" style={{display: this.props.open ? 'flex' : 'none'}}>
        <div className="sticker-picker__popout__header">
          <IconButton className="popout-tab" onClick={this.handleTabClick.bind(this, false)} style={{width: '35px', height: '35px'}} tooltip="Recently used" tooltipPosition="top-center">
            <FontIcon className="material-icons" color={Colors.grey500}>access_time</FontIcon>
          </IconButton>

          {packTabs}
        </div>

        <div className="sticker-picker__popout__body">
          {stickers}
        </div>
      </div>
    );
  },

});

module.exports = StickerPickerPopout;
