import React from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import formatTime from './formatTime';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

const CommentThread = props => {
  const { classes, commentData } = props;
  const {
    c_pretty_created_date,
    replies,
    start_seconds,
    text,
    user,
    id,
  } = commentData;

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'commentThreadPopup',
  });

  const displayComment = (id, fname, lname, avatar, date, text) => {
    return (
      <ListItem key={id} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={`${fname} ${lname}`}
            src={avatar}
            className={classes.avatar}
          />
        </ListItemAvatar>
        <ListItemText>
          <Typography variant="body2">{`${fname} ${lname}`}</Typography>
          <Typography variant="caption" color="textSecondary">
            {date}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {text}
          </Typography>
        </ListItemText>
      </ListItem>
    );
  };

  return (
    <div>
      <Avatar
        {...bindHover(popupState)}
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
            {displayComment(
              id,
              user.first_name,
              user.last_name,
              user.profile_img_url,
              c_pretty_created_date,
              text
            )}
            {replies.map((reply, i) => {
              return displayComment(
                i,
                reply.user.first_name,
                reply.user.last_name,
                reply.user.profile_img_url,
                reply.c_pretty_created_date,
                reply.text
              );
            })}
          </List>
        </Card>
      </Popover>
    </div>
  );
};

export default withStyles(styles)(CommentThread);
