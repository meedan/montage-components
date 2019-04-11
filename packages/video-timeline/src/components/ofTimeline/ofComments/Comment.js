import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CommentForm from './CommentForm';

const styles = {
  avatar: {
    height: 28,
    width: 28,
  },
  ListItem: {
    width: '240px',
  },
  listItemSecondaryAction: {
    top: 8,
    transform: 'none',
  },
};

function Comment(props) {
  const {
    isRoot,
    isActionable,
    classes,
    id,
    fname,
    lname,
    avatar,
    date,
    text,
  } = props;

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

  const displayActions = () => {
    if (isActionable) {
      return isRoot ? (
        <IconButton
          aria-label="Edit"
          className={classes.editToggle}
          onClick={() => setEditMode(true)}
        >
          <Tooltip title="Edit">
            <EditIcon fontSize="small" />
          </Tooltip>
        </IconButton>
      ) : (
        <IconButton
          aria-label="More"
          className={classes.editToggle}
          // onClick={() => setEditMode(true)}
        >
          <Tooltip title="More">
            <MoreVertIcon fontSize="small" />
          </Tooltip>
        </IconButton>
      );
    }
    return null;
  };

  return (
    <ListItem
      alignItems="flex-start"
      className={classes.ListItem}
      component="div"
      key={id}
    >
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
            isEditing
            onCancel={closeCommentForm}
            onSubmit={text => handleCommentChange(text, id)}
            value={text}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            {text}
          </Typography>
        )}
      </ListItemText>
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        {displayActions()}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default withStyles(styles)(Comment);
