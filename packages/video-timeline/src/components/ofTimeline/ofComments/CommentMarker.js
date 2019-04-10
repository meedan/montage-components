import React from 'react';
import {
  usePopupState,
  bindHover,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import TriggerPopover from '@material-ui/core/Popover';

import CommentThread from './CommentThread';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

function CommentPopover(props) {
  const { classes, commentData } = props;
  const { user } = commentData;

  const readPopupState = usePopupState({
    variant: 'popover',
    popupId: 'readCommentPopoverPopup',
  });
  const editPopupState = usePopupState({
    variant: 'popover',
    popupId: 'editCommentPopoverPopup',
  });

  return (
    <div>
      <Avatar
        {...bindHover(readPopupState)}
        {...bindTrigger(editPopupState)}
        alt={`${user.first_name} ${user.last_name}`}
        className={classes.avatar}
        src={user.profile_img_url}
      />
      <HoverPopover
        {...bindPopover(readPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
        onClick={e => e.stopPropagation()}
      >
        <Card>
          <CommentThread commentData={commentData} />
        </Card>
      </HoverPopover>
      <TriggerPopover
        {...bindPopover(editPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
        onClick={e => e.stopPropagation()}
      >
        <Card>
          <CommentThread
            commentData={commentData}
            isActionable
            onClose={editPopupState.close}
          />
        </Card>
      </TriggerPopover>
    </div>
  );
}

export default withStyles(styles)(CommentPopover);
