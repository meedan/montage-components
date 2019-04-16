import React, { Component } from 'react';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
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

  ${({ isEditable, isProcessing }) =>
    isEditable || isProcessing
      ? `
    ${TagAdornment} {
      visibility: visible;
    }

  `
      : ''};

  ${({ isHovered, editable }) =>
    isHovered && !editable
      ? `
        ${TagAdornment} {
          visibility: visible;
        }`
      : ''};
`;

class TagMeta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditable: false,
      isHovered: false,
      isProcessing: false,
      isDeleting: false,
      newTagName: props.tagName,
    };

    this.inputRef = React.createRef();
  }

  render() {
    const { currentTime, classes, tagName, tagId } = this.props;

    const toggleTagRename = () => {
      this.setState({ isHovered: false, isEditable: true }, () =>
        this.inputRef.current.focus()
      );
    };
    const toggleTagRenameOff = () => {
      if (this.state.isEditable)
        this.setState({ isEditable: false, isHovered: false });
    };
    const handleTagSave = () => {
      this.setState({ isProcessing: true, isEditable: false });
      // wire tag delete API calls
      console.group('handleTagSave()');
      console.log(this.state.newTagName);
      console.groupEnd();
      setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: disable processing on either error or success
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
      this.setState({ isDeleting: true });
    };
    const handleTagDelete = () => {
      this.setState({
        isProcessing: true,
        isHovered: false,
        isDeleting: false,
      });
      // TODO: wire tag delete API calls
      console.group('handleTagDelete()');
      console.log({ tagId });
      console.groupEnd();
      setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: disable processing on either error or success
    };

    return (
      <>
        <TagControls
          isEditable={this.state.isEditable}
          isHovered={this.state.isHovered}
          isProcessing={this.state.isProcessing}
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
        >
          <ClickAwayListener onClickAway={toggleTagRenameOff}>
            <TextField
              autoComplete={false}
              autoFocus
              className={classes.TextField}
              defaultValue={tagName}
              inputRef={this.inputRef}
              disabled={!this.state.isEditable}
              fullWidth
              onClick={!this.state.isEditable ? placeNewMarker : null}
              onChange={e =>
                this.setState({ newTagName: e.currentTarget.value })
              }
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
                  !this.state.isEditable || this.state.isProcessing ? (
                    <TagAdornment>
                      <InputAdornment position="end">
                        {this.state.isProcessing ? (
                          <CircularProgress
                            size={18}
                            className={classes.CircularProgress}
                          />
                        ) : (
                          <PopupState
                            variant="popover"
                            popupId="moreTagOptionsPopover"
                          >
                            {popupState => (
                              <div>
                                <IconButton
                                  {...bindHover(popupState)}
                                  aria-label="Options…"
                                >
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
                                    <ListItem button onClick={toggleTagRename}>
                                      <ListItemText>Rename</ListItemText>
                                    </ListItem>
                                    <ListItem button onClick={toggleTagDelete}>
                                      <ListItemText>Delete</ListItemText>
                                    </ListItem>
                                  </List>
                                </Popover>
                              </div>
                            )}
                          </PopupState>
                        )}
                      </InputAdornment>
                    </TagAdornment>
                  ) : null,
              }}
            />
          </ClickAwayListener>
        </TagControls>
        {this.state.isDeleting ? (
          <DeleteTagModal
            handleClose={() => this.setState({ isDeleting: false })}
            handleRemove={handleTagDelete}
            tagName={tagName}
          />
        ) : null}
      </>
    );
  }
}

export default withStyles(styles)(TagMeta);
