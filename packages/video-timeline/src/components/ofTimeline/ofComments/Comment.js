import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CommentForm from './CommentForm';

const styles = {
  avatar: {
    height: 24,
    width: 24,
  },
  ListItem: {
    width: '220px',
  },
  listItemSecondaryAction: {
    top: 8,
    transform: 'none',
  },
};

function Comment(props) {
  const { isActionable, classes, id, fname, lname, avatar, date, text } = props;

  const [editMode, setEditMode] = useState(false);

  const closeCommentForm = () => {
    setEditMode(false);
  };
  const handleCommentChange = (text, id) => {
    // TODO: wire this up to save changes to the comment
    setEditMode(false);
    console.group('handleCommentChange()');
    console.log({ id });
    console.log({ text });
    console.groupEnd();
  };

  return (
    <ListItem alignItems="flex-start" key={id} className={classes.ListItem}>
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
        {editMode ? (
          <CommentForm
            handleCancel={closeCommentForm}
            handleSubmit={text => handleCommentChange(text, id)}
            value={text}
            isEditing
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            {text}
          </Typography>
        )}
      </ListItemText>
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        {isActionable ? (
          <IconButton
            aria-label="Edit"
            className={classes.editToggle}
            onClick={() => setEditMode(true)}
          >
            <Tooltip title="Edit">
              <EditIcon fontSize="small" />
            </Tooltip>
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default withStyles(styles)(Comment);
