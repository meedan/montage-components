import React, { useState } from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';

const styles = {
  TextField: {
    marginBottom: 0,
    marginTop: 0,
  },
  InputRoot: {
    borderBottom: `1px solid ${grey[300]}`,
    fontSize: '13px',
    paddingLeft: '12px',
  },
  InputDisabled: {
    border: 'none',
    color: grey[600],
    '&:hover': {
      color: grey[800],
    },
    '&:before': {
      border: 'none !important',
    },
  },
};

const TagAdornment = styled.div`
  visibility: hidden;
`;
const TagControls = styled.div`
  width: 224px;
  ${({ hovered }) =>
    hovered
      ? `
        ${TagAdornment} {
          visibility: visible;
        }`
      : ''};
`;

function TagMeta(props) {
  const { currentTime, classes, tagName, tagId } = props;
  const popupState = usePopupState({
    popupId: 'MoreMenuItem',
    variant: 'popover',
  });

  const [editable, setEditable] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleTagRename = () => {
    setEditable(true);
    setHovered(false);
    popupState.close();
  };
  const handleTagSave = () => {
    setEditable(false);
  };
  const placeNewMarker = () => {
    // TODO:
    console.group('placeNewMarker()');
    console.log({ tagName });
    console.log({ tagId });
    console.log({ currentTime });
    console.groupEnd();
  };
  const handleTagDelete = () => {
    // TODO: wire tag delete API calls
    popupState.close();
    setHovered(false);
    console.group('handleTagDelete()');
    console.log({ tagId });
    console.groupEnd();
  };

  return (
    <TagControls
      hovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TextField
        className={classes.TextField}
        autoComplete={false}
        autoFocus
        onClick={placeNewMarker}
        defaultValue={tagName}
        fullWidth
        disabled={!editable}
        required
        InputProps={{
          classes: {
            root: classes.InputRoot,
            disabled: classes.InputDisabled,
          },
          fullWidth: true,
          endAdornment: (
            <TagAdornment>
              <InputAdornment position="end">
                {editable ? (
                  <IconButton aria-label="Save" onClick={handleTagSave}>
                    <CheckIcon />
                  </IconButton>
                ) : (
                  <IconButton {...bindHover(popupState)} aria-label="Options…">
                    <MoreVertIcon />
                  </IconButton>
                )}
              </InputAdornment>
            </TagAdornment>
          ),
        }}
      />
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
          <ListItem button onClick={toggleTagRename}>
            <ListItemText>Rename</ListItemText>
          </ListItem>
          <ListItem button onClick={handleTagDelete}>
            <ListItemText>Delete</ListItemText>
          </ListItem>
        </List>
      </Popover>
    </TagControls>
  );
}

export default withStyles(styles)(TagMeta);
