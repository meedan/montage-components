import React, { useState } from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
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
  savingProgress: {},
};

const Mask = styled.div`
  align-items: center;
  background: rgba(255, 255, 255, 0.66);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
`;

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
  const [isProcessing, setProcessingStatus] = useState(false);

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

    setProcessingStatus(true);
    setEditMode(false);
    setTimeout(() => setProcessingStatus(false), 1000); // TODO: make this real

    console.group('handleCommentEdit()');
    console.log(isRoot ? { id } : `${id} > ${threadId}`);
    console.log({ text });
    console.groupEnd();
  };
  const handleCommentDelete = () => {
    // TODO: wire this up to delete comment
    setProcessingStatus(true);
    setEditMode(false);
    setTimeout(() => setProcessingStatus(false), 1000); // TODO: make this real
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
                <ListItemText>Edit</ListItemText>
              </ListItem>
              {!isRoot ? (
                <ListItem button onClick={handleCommentDelete}>
                  <ListItemText>Delete</ListItemText>
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
      {isProcessing && (
        <Mask>
          <CircularProgress size={22} className={classes.savingProgress} />
        </Mask>
      )}
    </ListItem>
  );
}

export default withStyles(styles)(Comment);
