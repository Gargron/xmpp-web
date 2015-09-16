let React = require('react');
let mui   = require('material-ui');

let FontIcon = mui.FontIcon;
let Colors   = mui.Styles.Colors;
let Avatar   = mui.Avatar;

let AvatarPicker = React.createClass({

  render () {
    let classes = ["photo-pick__preview"];
    let size    = this.props.size;

    if (this.props.photo === '') {
      classes.push("is-empty");
    }

    return (
      <div className={classes.join(' ')} style={{ width: size + 'px', height: size + 'px', borderRadius: size + 'px' }} onClick={this.props.onClick}>
        <div className="photo-pick__preview__overlay"><FontIcon className="material-icons" color={Colors.white}>file_upload</FontIcon></div>
        <Avatar src={this.props.photo} size={size} />
      </div>
    );
  },

});

module.exports = AvatarPicker;
