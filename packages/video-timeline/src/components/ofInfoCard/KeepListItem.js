import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import KeepIcon from '@montage/ui/src/components/icons/KeepIcon';

const KeepListItem = props => {
  const { data } = props;
  return (
    <ListItem button onClick={() => console.log('Hello')}>
      <ListItemIcon>
        <KeepIcon />
      </ListItemIcon>
      <ListItemText
        primary="Send video to Keep"
        primaryTypographyProps={{ variant: 'button', color: 'primary' }}
      />
    </ListItem>
  );
};

export default KeepListItem;
