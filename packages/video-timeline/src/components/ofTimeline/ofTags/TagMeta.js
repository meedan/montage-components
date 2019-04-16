import React, { useState } from 'react';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';

import DeleteTagModal from './DeleteTagModal';

const styles = {
  TextField: {
    marginBottom: 0,
    marginTop: 0,
  },
  InputRoot: {
    borderBottom: `1px solid ${grey[300]}`,
    fontSize: '13px',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  InputDisabled: {
    border: 'none',
    cursor: 'pointer',
    color: grey[600],
    '&:hover': {
      color: grey[800],
    },
    '&:before': {
      border: 'none !important',
    },
  },
  CircularProgress: {
    position: 'relative',
    left: '-8px',
  },
};

const TagAdornment = styled.div`
  visibility: hidden;
`;
const TagControls = styled.div`
  width: 224px;

  ${({ editable, isProcessing }) =>
    editable || isProcessing
      ? `
    ${TagAdornment} {
      visibility: visible;
    }

  `
      : ''};

  ${({ hovered, editable }) =>
    hovered && !editable
      ? `
        ${TagAdornment} {
          visibility: visible;
        }`
      : ''};
`;

function TagMeta(props) {
  const { currentTime, classes, tagName, tagId } = props;

  // let thisFieldRef = createRef();

  const popupState = usePopupState({
    popupId: 'MoreMenuItem',
    variant: 'popover',
  });

  const [editable, setEditable] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newTagName, setNewTagName] = useState(tagName);
  const [isDeleting, setIsDeleting] = useState(false);

  // console.log({ thisFieldRef });

  const toggleTagRename = () => {
    setHovered(false);
    popupState.close();
    // console.log({ thisFieldRef });
    setEditable(true);
    // thisFieldRef.current.focus()
  };
  const toggleTagRenameOff = () => {
    if (editable) {
      setEditable(false);
      setHovered(false);
    }
    return null;
  };
  const handleTagSave = () => {
    setIsProcessing(true);
    setEditable(false);
    // wire tag delete API calls
    console.group('handleTagSave()');
    console.log({ newTagName });
    console.groupEnd();
    setTimeout(() => setIsProcessing(false), 1000); // TODO: disable processing on either error or success
  };
  const placeNewMarker = () => {
    // TODO:
    console.group('placeNewMarker()');
    console.log({ tagName });
    console.log({ tagId });
    console.log({ currentTime });
    console.groupEnd();
  };
  const toggleTagDelete = () => {
    setIsDeleting(true);
  };
  const handleTagDelete = () => {
    setIsProcessing(true);
    setHovered(false);
    setIsDeleting(false);
    popupState.close();
    // TODO: wire tag delete API calls
    console.group('handleTagDelete()');
    console.log({ tagId });
    console.groupEnd();
    setTimeout(() => setIsProcessing(false), 1000); // TODO: disable processing on either error or success
  };

  return (
    <>
      <TagControls
        hovered={hovered}
        editable={editable}
        isProcessing={isProcessing}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ClickAwayListener onClickAway={toggleTagRenameOff}>
          <TextField
            autoComplete={false}
            autoFocus
            className={classes.TextField}
            defaultValue={tagName}
            // inputRef={thisFieldRef}
            disabled={!editable}
            fullWidth
            onClick={!editable ? placeNewMarker : null}
            onChange={e => setNewTagName(e.currentTarget.value)}
            onKeyPress={ev => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                handleTagSave();
              }
            }}
            required
            InputProps={{
              classes: {
                root: classes.InputRoot,
                disabled: classes.InputDisabled,
              },
              fullWidth: true,
              endAdornment:
                !editable || isProcessing ? (
                  <TagAdornment>
                    <InputAdornment position="end">
                      {isProcessing ? (
                        <CircularProgress
                          size={18}
                          className={classes.CircularProgress}
                        />
                      ) : (
                        <IconButton
                          {...bindHover(popupState)}
                          aria-label="Options…"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  </TagAdornment>
                ) : null,
            }}
          />
        </ClickAwayListener>
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
            <ListItem button onClick={toggleTagDelete}>
              <ListItemText>Delete</ListItemText>
            </ListItem>
          </List>
        </Popover>
      </TagControls>
      {isDeleting ? (
        <DeleteTagModal
          handleClose={() => setIsDeleting(false)}
          handleRemove={handleTagDelete}
          tagName={tagName}
        />
      ) : null}
    </>
  );
}

export default withStyles(styles)(TagMeta);
