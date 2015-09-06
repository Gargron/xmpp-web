let React   = require('react');
let mui     = require('material-ui');
let Reflux  = require('reflux');
let Actions = require('../actions');

let FontIcon   = mui.FontIcon;
let IconButton = mui.IconButton;
let Colors     = mui.Styles.Colors;

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

let StickerPickerPopout = React.createClass({

  render () {
    let stickers = [
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
      { id: 'aikatsu', pack: 'misc', org: 'walfas' },
    ].map(function (sticker, i) {
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

let StickerPicker = React.createClass({
  mixins: [
    mui.Mixins.ClickAwayable,
    Reflux.listenTo(Actions.sendSticker, 'onSendSticker'),
  ],

  getInitialState () {
    return {
      open: false,
    };
  },

  handleClick (e) {
    this.setState({
      open: !this.state.open,
    });
  },

  onSendSticker () {
    this.setState({
      open: false,
    });
  },

  componentClickAway () {
    this.setState({
      open: false,
    });
  },

  render () {
    return (
      <div className="sticker-picker">
        <StickerPickerPopout open={this.state.open} {...this.props} />

        <IconButton style={{marginTop: '10px', padding: '0px', width: '44px', height: '44px', marginLeft: '-16px'}} onClick={this.handleClick}>
          <FontIcon className="material-icons" color={Colors.grey500} hoverColor={Colors.grey900}>insert_emoticon</FontIcon>
        </IconButton>
      </div>
    );
  },

});

module.exports = StickerPicker;
