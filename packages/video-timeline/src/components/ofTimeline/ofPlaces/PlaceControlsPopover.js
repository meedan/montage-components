import Popover from 'material-ui-popup-state/HoverPopover';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function PlaceControlsPopover(props) {
  const { onStartRename, onStartDelete, onStartReposition } = props;
  return (
    <PopupState variant="popover" popupId="morePlaceOptionsPopover">
      {popupState => (
        <div>
          <IconButton {...bindHover(popupState)} aria-label="Options…">
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
              <ListItem button onClick={onStartRename}>
                <ListItemText>Rename</ListItemText>
              </ListItem>
              <ListItem button onClick={onStartReposition}>
                <ListItemText>Reposition</ListItemText>
              </ListItem>
              <ListItem button onClick={onStartDelete}>
                <ListItemText>Delete</ListItemText>
              </ListItem>
            </List>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}

export default PlaceControlsPopover;
