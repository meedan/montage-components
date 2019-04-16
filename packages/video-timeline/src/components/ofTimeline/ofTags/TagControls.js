import React, { Component } from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import TagDeleteModal from './TagDeleteModal';
import TagControlsPopover from './TagControlsPopover';

const styles = {
  Grid: {
    marginLeft: '12px',
    marginRight: '12px',
    width: '200px',
  },
  Typography: {
    maxWidth: '160px',
  },
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
  CircularProgress: {
    position: 'relative',
    left: '-8px',
  },
};

const TagControlsEllipsis = styled.div`
  visibility: hidden;
`;
const El = styled.div`
  cursor: pointer;
  width: 224px;
  ${({ hasAdornment }) =>
    hasAdornment
      ? `
    ${TagControlsEllipsis} {
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
  }

  static getDerivedStateFromProps(props, state) {
    // if (props.isBeingAdded) this.setState({ isCreating: true });
    return { ...state, tagName: props.tagName };
  }

  startTagRename = () => {
    this.setState({ isHovering: false, isEditing: true });
  };

  stopTagRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  handleTagRename = () => {
    this.setState({ isProcessing: true, isEditing: false });
    // TODO: wire tag delete API calls
    console.group('handleTagRename()');
    console.log('tagName:', this.state.tagName);
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
    console.log('tagId:', this.props.tagId);
    console.groupEnd();
    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startNewInstance = () => {
    // TODO: wire create new instance API calls
    console.group('startNewInstance()');
    console.log('tagId:', this.props.tagId);
    console.log('start_seconds:', this.props.currentTime);
    console.groupEnd();
  };

  render() {
    const { classes } = this.props;
    const {
      isCreating,
      isDeleting,
      isEditing,
      isHovering,
      isProcessing,
    } = this.state;

    const tagInReadMode = (
      <Grid
        alignItems="center"
        className={classes.Grid}
        container
        justify="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <Typography
            className={classes.Typography}
            color="textSecondary"
            noWrap
            variant="body2"
          >
            {this.state.tagName}
          </Typography>
        </Grid>
        <Grid item>
          <TagControlsEllipsis onClick={e => e.stopPropagation()}>
            {isProcessing ? (
              <CircularProgress
                size={18}
                className={classes.CircularProgress}
              />
            ) : (
              <TagControlsPopover
                onStartRename={this.startTagRename}
                onStartDelete={this.startTagDelete}
              />
            )}
          </TagControlsEllipsis>
        </Grid>
      </Grid>
    );

    const tagInEditMode = (
      <ClickAwayListener onClickAway={this.stopTagRename}>
        <TextField
          autoComplete="false"
          autoFocus
          className={classes.TextField}
          defaultValue={this.state.tagName}
          fullWidth
          onChange={e => this.setState({ tagName: e.currentTarget.value })}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.handleTagRename();
            }
          }}
          required
          InputProps={{
            classes: {
              root: classes.InputRoot,
            },
          }}
        />
      </ClickAwayListener>
    );

    return (
      <El
        hasAdornment={isEditing || isHovering || isProcessing}
        onClick={!isEditing ? this.startNewInstance : null}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        {isEditing ? tagInEditMode : tagInReadMode}
        {isDeleting ? (
          <TagDeleteModal
            handleClose={this.stopTagDelete}
            handleRemove={this.handleTagDelete}
            tagName={this.state.tagName}
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(TagControls);
