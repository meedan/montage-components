import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import Comment from './Comment';

import formatTime from '../formatTime';

function CommentThread(props) {
  const { commentData, isActionable } = props;
  const {
    c_pretty_created_date,
    replies,
    start_seconds,
    text,
    user,
    id,
  } = commentData;

  return (
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
        avatar={user.profile_img_url}
        date={c_pretty_created_date}
        fname={user.first_name}
        id={id}
        isActionable={isActionable}
        lname={user.last_name}
        text={text}
      />
      {replies.map((reply, i) => {
        return (
          <Comment
            avatar={reply.user.profile_img_url}
            date={reply.c_pretty_created_date}
            fname={reply.user.first_name}
            id={i}
            isActionable={isActionable}
            lname={reply.user.last_name}
            text={reply.text}
          />
        );
      })}
    </List>
  );
}

export default CommentThread;
