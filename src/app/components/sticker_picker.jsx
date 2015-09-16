let React         = require('react');
let mui           = require('material-ui');
let Reflux        = require('reflux');
let Actions       = require('../actions');

let FontIcon   = mui.FontIcon;
let IconButton = mui.IconButton;
let Colors     = mui.Styles.Colors;

let StickerPickerPopout = require('./sticker_picker_popout');

let StickerPicker = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    mui.Mixins.ClickAwayable,
    Reflux.listenTo(Actions.sendMessage, 'onSendMessage'),
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

  onSendMessage (jid, body, type) {
    if (type !== 'sticker') {
      return;
    }

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
