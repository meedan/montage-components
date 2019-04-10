import React, { useState } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';

const styles = {
  avatar: {
    height: 28,
    width: 28,
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
  const [comment, setComment] = useState(text);

  const abbandonCommentEdit = () => {
    setComment(text);
    setEditMode(false);
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
          <Grid container direction="column" spacing={8} wrap="nowrap">
            <Grid item>
              <TextField
                autoFocus
                defaultValue={comment}
                fullWidth
                id="comment"
                inputProps={{
                  autoComplete: 'off',
                  style: { fontSize: '13px' },
                }}
                placeholder="Enter comment"
                required
                type="text"
                onChange={e => setComment(e.currentTarget.value)}
                className={classes.commentInput}
              />
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row-reverse"
                justify="space-between"
                wrap="nowrap"
              >
                <Grid item>
                  <Button
                    color="primary"
                    disabled={comment.length === 0}
                    mini
                    // onClick={createCollection}
                    size="small"
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button mini onClick={abbandonCommentEdit} size="small">
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
