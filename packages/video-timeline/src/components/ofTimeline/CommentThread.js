import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popover from 'material-ui-popup-state/HoverPopover';
import Avatar from '@material-ui/core/Avatar';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

const CommentThread = props => {
  const { classes, commentData } = props;

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'commentThreadPopup',
  });
  return (
    <div>
      <Avatar
        {...bindHover(popupState)}
        alt={`${commentData.user.first_name} ${commentData.user.last_name}`}
        className={classes.avatar}
        src={commentData.user.profile_img_url}
      />
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        <Typography style={{ margin: 10 }}>
          The content of the Popover.
        </Typography>
      </Popover>
    </div>
  );
};

export default withStyles(styles)(CommentThread);
