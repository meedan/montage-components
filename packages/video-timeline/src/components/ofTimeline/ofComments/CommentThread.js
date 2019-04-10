import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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

  const handleReply = comment => {
    // TODO: wire adding new comments here, also log user data
    console.group('handleReply()');
    console.log({ comment });
    console.groupEnd();
  };

  return (
    <List
      dense
      subheader={
        <>
          <ListSubheader
            component="div"
            disableSticky
            className={classes.ListSubheader}
          >
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography color="textSecondary" variant="overline">
                  {formatTime(start_seconds)}
                </Typography>
              </Grid>
              <Grid item>
                {isActionable ? (
                  <IconButton>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Grid>
            </Grid>
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
        <>
          <Divider />
          <ListItem>
            <ListItemText>
              <CommentForm onCancel={closePopup} onSubmit={handleReply} />
            </ListItemText>
          </ListItem>
        </>
      ) : null}
    </List>
  );
}

export default withStyles(styles)(CommentThread);
