import React, { Component } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import grey from '@material-ui/core/colors/grey';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import DeleteTagModal from './DeleteTagModal';
import TagControlsEllipsis from './TagControlsEllipsis';

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
const El = styled.div`
  width: 224px;
  ${({ hasAdornment }) =>
    hasAdornment
      ? `
    ${TagAdornment} {
      visibility: visible;
    }
  `
      : ''};
`;

class TagControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isHovering: false,
      isProcessing: false,
      isDeleting: false,
      isCreating: false,
      tagName: '',
    };

    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    // if (props.isBeingAdded) this.setState({ isCreating: true });
    return { ...state, tagName: props.tagName };
  }

  startTagRename = () => {
    this.setState({ isHovering: false, isEditing: true }, () =>
      this.inputRef.current.focus()
    );
  };

  stopTagRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  handleTagRename = () => {
    this.setState({ isProcessing: true, isEditing: false });
    // TODO: wire tag delete API calls
    console.group('handleTagRename()');
    console.log(this.state.tagName);
    console.groupEnd();
    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startTagDelete = () => {
    this.setState({ isDeleting: true });
  };

  stopTagDelete = () => {
    this.setState({ isDeleting: false });
  };

  handleTagDelete = () => {
    this.setState({ isProcessing: true, isDeleting: false });
    // TODO: wire tag delete API calls
    console.group('handleTagDelete()');
    console.log(this.props.tagId);
    console.groupEnd();
    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  render() {
    const { currentTime, classes, tagId } = this.props;
    const {
      isCreating,
      isDeleting,
      isEditing,
      isHovering,
      isProcessing,
      tagName,
    } = this.state;

    const placeNewMarker = () => {
      // TODO:
      console.group('placeNewMarker()');
      console.log({ tagName });
      console.log({ tagId });
      console.log({ currentTime });
      console.groupEnd();
    };

    return (
      <>
        <El
          hasAdornment={isEditing || isHovering || isProcessing}
          onMouseEnter={() => this.setState({ isHovering: true })}
          onMouseLeave={() => this.setState({ isHovering: false })}
        >
          <ClickAwayListener onClickAway={this.stopTagRename}>
            <TextField
              autoComplete={false}
              autoFocus
              className={classes.TextField}
              defaultValue={tagName}
              inputRef={this.inputRef}
              disabled={!isEditing}
              fullWidth
              onClick={!isEditing ? placeNewMarker : null}
              onChange={e => this.setState({ tagName: e.currentTarget.value })}
              onKeyPress={ev => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  this.handleTagRename();
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
                  !isEditing || isProcessing ? (
                    <TagAdornment>
                      <InputAdornment position="end">
                        {isProcessing ? (
                          <CircularProgress
                            size={18}
                            className={classes.CircularProgress}
                          />
                        ) : (
                          <TagControlsEllipsis
                            onStartRename={this.startTagRename}
                            onStartDelete={this.startTagDelete}
                          />
                        )}
                      </InputAdornment>
                    </TagAdornment>
                  ) : null,
              }}
            />
          </ClickAwayListener>
        </El>
        {isDeleting ? (
          <DeleteTagModal
            handleClose={this.stopTagDelete}
            handleRemove={this.handleTagDelete}
            tagName={tagName}
          />
        ) : null}
      </>
    );
  }
}

export default withStyles(styles)(TagControls);
