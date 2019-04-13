import React, { useState } from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
  moreMenuIcon: {
    top: '3px',
    marginRight: '8px',
    position: 'relative',
  },
};

function Comment(props) {
  const {
    isRoot,
    isActionable,
    classes,
    id,
    threadId,
    fname,
    lname,
    avatar,
    date,
    text,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const popupState = usePopupState({
    popupId: 'MoreMenuItem',
    variant: 'popover',
  });

  const toggleCommentEdit = () => {
    setEditMode(true);
    popupState.close();
  };
  const handleCommentEdit = text => {
    // TODO: wire this up to save changes to the comment
    // the first comment will have `isRoot` prop set
    // the first comment can be accessed with `id`
    // subsequent comments have also threadId (which is first comment’s id)
    setEditMode(false);
    console.group('handleCommentEdit()');
    console.log(isRoot ? { id } : `${id} > ${threadId}`);
    console.log({ text });
    console.groupEnd();
  };
  const handleCommentDelete = () => {
    // TODO: wire this up to delete comment
    setEditMode(false);
    popupState.close();
    console.group('handleCommentDelete()');
    console.log({ threadId });
    console.log({ id });
    console.groupEnd();
  };

  const displayActions = () => {
    if (isActionable) {
      return (
        <>
          <IconButton {...bindHover(popupState)}>
            <MoreVertIcon />
          </IconButton>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            disableRestoreFocus
          >
            <List dense>
              <ListItem button onClick={toggleCommentEdit}>
                <ListItemText>
                  <EditIcon fontSize="small" className={classes.moreMenuIcon} />{' '}
                  Edit
                </ListItemText>
              </ListItem>
              {!isRoot ? (
                <ListItem button onClick={handleCommentDelete}>
                  <ListItemText>
                    <DeleteIcon
                      fontSize="small"
                      className={classes.moreMenuIcon}
                    />{' '}
                    Delete
                  </ListItemText>
                </ListItem>
              ) : null}
            </List>
          </Popover>
        </>
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
            onCancel={() => setEditMode(false)}
            onSubmit={text => handleCommentEdit(text, id)}
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
