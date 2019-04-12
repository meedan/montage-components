import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Comment from './Comment';
import CommentForm from './CommentForm';

import formatTime from '../formatTime';

const styles = {
  ListSubheader: {
    background: grey[200],
  },
};

function CommentThread(props) {
  const { classes, commentData, closePopup, isActionable } = props;
  const {
    c_pretty_created_date,
    replies,
    start_seconds,
    text,
    user,
    id,
  } = commentData;

  const threadId = id;

  const handleThreadReply = comment => {
    // TODO: wire adding new comments here, also log user data
    console.group('handleThreadReply()');
    console.log({ comment });
    console.groupEnd();
  };
  const handleThreadDelete = comment => {
    // TODO: wire deleting comment thread here
    console.group('handleThreadDelete()');
    console.log({ threadId });
    console.groupEnd();
    closePopup();
  };

  return (
    <List
      dense
      component="div"
      subheader={
        <>
          <ListItem component="div" className={classes.ListSubheader}>
            <ListItemText>
              <Typography color="textSecondary" variant="overline">
                {formatTime(start_seconds)}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              {isActionable ? (
                <IconButton
                  aria-label="Delete thread"
                  onClick={handleThreadDelete}
                >
                  <Tooltip title="Delete thread">
                    <DeleteIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
              ) : null}
            </ListItemSecondaryAction>
          </ListItem>
        </>
      }
    >
      <Comment
        avatar={user.profile_img_url}
        date={c_pretty_created_date}
        fname={user.first_name}
        id={threadId}
        isActionable={isActionable}
        isRoot
        lname={user.last_name}
        text={text}
      />
      {replies.map((reply, i) => {
        return (
          <Comment
            avatar={reply.user.profile_img_url}
            date={reply.c_pretty_created_date}
            fname={reply.user.first_name}
            id={reply.id}
            isActionable={isActionable}
            lname={reply.user.last_name}
            text={reply.text}
            threadId={reply.thread_id}
          />
        );
      })}
      {isActionable ? (
        <>
          <ListItem>
            <ListItemText>
              <CommentForm onCancel={closePopup} onSubmit={handleThreadReply} />
            </ListItemText>
          </ListItem>
        </>
      ) : null}
    </List>
  );
}

export default withStyles(styles)(CommentThread);
