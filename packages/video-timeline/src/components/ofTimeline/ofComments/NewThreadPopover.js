import React, { Component } from 'react';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Popover from '@material-ui/core/Popover';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

class NewCommentThreadPopover extends Component {
  constructor(props) {
    super(props);
    this.avatarRef = React.createRef();
  }

  render() {
    const { classes, commentData } = this.props;
    const { user } = commentData;
    const open = Boolean(this.avatarRef);
    console.log(this.avatarRef);
    return (
      <div ref={this.avatarRef}>
        {open ? (
          <PopupState variant="popover" popupId="newCommentThread">
            {popupState => (
              <>
                <Avatar
                  {...bindTrigger(popupState)}
                  alt={`${user.first_name} ${user.last_name}`}
                  className={classes.avatar}
                  src={user.profile_img_url}
                />
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  anchorEl={this.avatarRef.current}
                  disableRestoreFocus
                  open={true}
                  onClick={e => e.stopPropagation()}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  Hello
                </Popover>
              </>
            )}
          </PopupState>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(NewCommentThreadPopover);
