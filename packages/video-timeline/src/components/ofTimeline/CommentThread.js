import 'rc-slider/assets/index.css';
import React from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';

const styles = {
  avatar: {
    height: 32,
    marginTop: -27,
    width: 32,
  },
};

function TimelineComment(props) {
  const { classes, commentData } = props;

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'CommentPopup',
  });

  return (
    <>
      <Avatar
        alt={`${commentData.user.first_name} ${commentData.user.last_name}`}
        className={classes.avatar}
        // onClick={e => console.log(e)}
        src={commentData.user.profile_img_url}
        {...bindHover(popupState)}
      />
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        Hello
      </Popover>
    </>
  );
}

export default withStyles(styles)(TimelineComment);
