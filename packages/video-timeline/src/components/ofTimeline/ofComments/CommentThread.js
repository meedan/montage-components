import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import Comment from './Comment';
import CommentForm from './CommentForm';

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

  const onReply = comment => {
    console.log('onReply');
    console.log(comment);
  };
  const onCancel = () => {
    console.log('onCancel');
    props.onClose();
  };

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
      {isActionable ? (
        <ListItem>
          <ListItemText>
            <CommentForm handleCancel={onCancel} handleSubmit={onReply} />
          </ListItemText>
        </ListItem>
      ) : null}
    </List>
  );
}

export default CommentThread;
