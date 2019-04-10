import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';

const styles = {
  avatar: {
    height: 32,
    width: 32,
    border: '1px solid white',
  },
};

function Comment(props) {
  const { isActionable, classes, id, fname, lname, avatar, date, text } = props;

  return (
    <ListItem key={id} alignItems="flex-start">
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
        <Typography variant="body2" color="textSecondary">
          {text}
        </Typography>
      </ListItemText>
      <ListItemSecondaryAction>
        {isActionable ? (
          <IconButton aria-label="Edit">
            <EditIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default withStyles(styles)(Comment);
