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
import NewThreadPopoover from './NewThreadPopover';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

function CommentPopover(props) {
  const { classes, commentData } = props;
  const { isBeingAdded, user } = commentData;

  let myRef = React.createRef();
  const open = Boolean(myRef);

  const readPopupState = usePopupState({
    variant: 'popover',
    popupId: 'readCommentPopoverPopup',
  });
  const editPopupState = usePopupState({
    variant: 'popover',
    popupId: 'editCommentPopoverPopup',
  });

  if (isBeingAdded) console.log({ myRef });
  if (isBeingAdded) console.log({ open });
  if (isBeingAdded) console.log(myRef.current);

  const existingThread = (
    <>
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
            closePopup={editPopupState.close}
            commentData={commentData}
            isActionable
          />
        </Card>
      </TriggerPopover>
    </>
  );

  return (
    <div ref={myRef}>
      {isBeingAdded ? (
        <NewThreadPopoover user={user} commentData={commentData} />
      ) : (
        existingThread
      )}
    </div>
  );
}

export default withStyles(styles)(CommentPopover);
