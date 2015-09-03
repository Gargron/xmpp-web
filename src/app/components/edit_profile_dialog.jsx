let React           = require('react');
let mui             = require('material-ui');
let Reflux          = require('reflux');
let ConnectionStore = require('../stores/connection');
let Actions         = require('../actions');

let ListItem   = mui.ListItem;
let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;
let Avatar     = mui.Avatar;
let Dialog     = mui.Dialog;
let CardMedia  = mui.CardMedia;
let TextField  = mui.TextField;

let EditProfileDialog = React.createClass({
  mixins: [
    Reflux.connect(ConnectionStore, 'connection'),
    Reflux.listenTo(Actions.openEditProfileDialog, 'onOpenEditProfileDialog'),
  ],

  onOpenEditProfileDialog () {
    this.setState({
      nickname: this.state.connection.account.get('nickname'),
      photo:    this.state.connection.account.get('photo'),
    });

    this.refs.dialog.show();
  },

  handleNicknameChange (e) {
    this.setState({
      nickname: e.target.value,
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

    reader.onload = function (output) {
      $this.setState({
        photo: output.target.result,
      });
    };

    reader.readAsDataURL(file);
  },

  handleSubmit () {
    Actions.updateProfile(this.state.nickname, this.state.photo);
    this.refs.dialog.dismiss();
  },

  render () {
    let photo = this.state.photo;

    let dialogActions = [
      { text: 'Cancel' },
      { text: 'Submit', ref: 'submit', onTouchTap: this.handleSubmit },
    ];

    let photoEdit;

    if (photo === '') {
      photoEdit = <Avatar className='photo-pick__preview' size={232} onClick={this.handlePhotoClick} />;
    } else {
      photoEdit = <Avatar className='photo-pick__preview' src={photo} size={232} onClick={this.handlePhotoClick} />;
    }

    return (
      <Dialog ref="dialog" actions={dialogActions} actionFocus="submit" contentClassName="edit-profile-dialog">
        <div className="photo-pick">
          {photoEdit}
          <input type="file" ref="photoFile" onChange={this.handlePhotoPick} />
        </div>

        <TextField hintText="Nickname" value={this.state.nickname} onChange={this.handleNicknameChange} fullWidth={true} />
      </Dialog>
    );
  },

});

module.exports = EditProfileDialog;
