import React from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';
import { format, parseISO } from 'date-fns';

import { withStyles } from '@material-ui/core/styles';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
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
  console.log({ commentData });
  console.log(commentData.start_seconds);

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
        onClick={e => e.stopPropagation()}
      >
        <Card>
          <List
            dense
            subheader={
              <>
                <ListSubheader component="div" disableSticky>
                  <Typography color="textSecondary" variant="overline">
                    {formatTime(commentData.start_seconds)}
                  </Typography>
                </ListSubheader>
                <Divider />
              </>
            }
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={`${commentData.user.first_name} ${
                    commentData.user.last_name
                  }`}
                  src={commentData.user.profile_img_url}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="body2">
                  {`${commentData.user.first_name} ${
                    commentData.user.last_name
                  }`}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {commentData.c_pretty_created_date}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {commentData.text}
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </Card>
      </Popover>
    </div>
  );
};

export default withStyles(styles)(CommentThread);
