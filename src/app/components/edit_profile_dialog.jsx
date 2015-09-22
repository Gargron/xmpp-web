let React           = require('react');
let mui             = require('material-ui');
let Reflux          = require('reflux');
let AccountStore    = require('../stores/account');
let Actions         = require('../actions');
let utils           = require('../utils');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;
let Avatar     = mui.Avatar;
let Dialog     = mui.Dialog;
let TextField  = mui.TextField;

let AvatarPicker = require('./avatar_picker');

let resizeImage = function (img, type) {
  const DIM  = 96;
  let canvas = document.createElement('canvas');
  let ctx    = canvas.getContext('2d');

  canvas.width  = DIM;
  canvas.height = DIM;
  img.width     = DIM;
  img.height    = DIM;

  ctx.clearRect(0, 0, DIM, DIM);
  ctx.drawImage(img, 0, 0, DIM, DIM);

  return canvas.toDataURL(type, 0.7);
};

let EditProfileDialog = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Reflux.connect(AccountStore, 'account'),
    Reflux.listenTo(Actions.openEditProfileDialog, 'onOpenEditProfileDialog'),
  ],

  onOpenEditProfileDialog () {
    this.setState({
      nickname: this.state.account.get('nickname'),
      photo:    this.state.account.get('photo'),
      status:   this.state.account.get('status'),
    });

    this.refs.dialog.show();
  },

  handleNicknameChange (e) {
    this.setState({
      nickname: e.target.value,
    });
  },

  handleStatusChange (e) {
    this.setState({
      status: e.target.value,
    });
  },

  handlePhotoClick () {
    let node = React.findDOMNode(this.refs.photoFile);
    node.click();
  },

  handlePhotoPick (e) {
    let file   = e.target.files[0];
    let reader = new FileReader();
    let $this  = this;

    if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1) {
      // XEP-0153: Only image/gif, image/jpeg, image/png file types allowed
      return;
    }

    reader.onload = function (output) {
      let dataURL = output.target.result;
      let testImg = document.createElement('img');

      testImg.onload = function () {
        // XEP-0153: Needs to be square
        if (testImg.width !== testImg.height) {
          console.log('Image not square');
          return;
        }

        // XEP-0153: Between 32x32 and 96x96
        if (testImg.width < 32 || testImg.width > 96) {
          console.log('Image not within dimension boundaries');
          dataURL = resizeImage(testImg, file.type);
        }

        // let blob = utils.dataURLToBlob(dataURL);
        //
        // if (blob.size > 8000) {
        //   // XEP-0153: Less than 8 kilobytes (8k) of data
        //   console.log('Image size too large', blob.size);
        //   return;
        // }

        $this.setState({
          photo: dataURL,
        });
      };

      testImg.src = dataURL;
    };

    reader.readAsDataURL(file);
  },

  handleSubmit () {
    if (this.state.nickname !== this.state.account.get('nickname') || this.state.photo !== this.state.account.get('photo')) {
      Actions.updateProfile(this.state.nickname, this.state.photo);
    }

    if (this.state.status !== this.state.account.get('status')) {
      Actions.updateStatus(this.state.status);
    }

    this.refs.dialog.dismiss();
  },

  render () {
    let dialogActions = [
      { text: 'Cancel' },
      { text: 'Submit', ref: 'submit', onTouchTap: this.handleSubmit },
    ];

    return (
      <Dialog ref="dialog" actions={dialogActions} actionFocus="submit" contentClassName="edit-profile-dialog">
        <div className="photo-pick">
          <AvatarPicker photo={this.state.photo} size={96} onClick={this.handlePhotoClick} />
          <input type="file" ref="photoFile" onChange={this.handlePhotoPick} />
        </div>

        <TextField hintText="Nickname" value={this.state.nickname} onChange={this.handleNicknameChange} fullWidth={true} />
        <TextField hintText="Status" value={this.state.status} onChange={this.handleStatusChange} fullWidth={true} />
      </Dialog>
    );
  },

});

module.exports = EditProfileDialog;
