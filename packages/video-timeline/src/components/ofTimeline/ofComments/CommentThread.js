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
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import TriggerPopover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import Comment from './Comment';

import formatTime from '../formatTime';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

function CommentThread(props) {
  const { classes, commentData } = props;
  const {
    c_pretty_created_date,
    replies,
    start_seconds,
    text,
    user,
    id,
  } = commentData;

  const readPopupState = usePopupState({
    variant: 'popover',
    popupId: 'readCommentThreadPopup',
  });
  const editPopupState = usePopupState({
    variant: 'popover',
    popupId: 'editCommentThreadPopup',
  });

  return (
    <div>
      <Avatar
        {...bindHover(readPopupState)}
        {...bindTrigger(editPopupState)}
        alt={`${user.first_name} ${user.last_name}`}
        className={classes.avatar}
        // onClick={toggleEditPopup}
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
          <List
            dense
            subheader={
              <>
                <ListSubheader component="div" disableSticky>
                  <Typography color="textSecondary" variant="overline">
                    {formatTime(start_seconds)}
                  </Typography>
                </ListSubheader>
                <Divider />
              </>
            }
          >
            <Comment
              id={id}
              fname={user.first_name}
              lname={user.last_name}
              avatar={user.profile_img_url}
              date={c_pretty_created_date}
              text={text}
            />
            {replies.map((reply, i) => {
              return (
                <Comment
                  id={i}
                  fname={reply.user.first_name}
                  lname={reply.user.last_name}
                  avatar={reply.user.profile_img_url}
                  date={reply.c_pretty_created_date}
                  text={reply.text}
                />
              );
            })}
          </List>
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
        <Card>Please, do show up</Card>
      </TriggerPopover>
    </div>
  );
}

export default withStyles(styles)(CommentThread);
