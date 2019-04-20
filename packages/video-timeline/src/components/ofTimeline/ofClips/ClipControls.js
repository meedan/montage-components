import React, { Component } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ClipControlsPopover from './ClipControlsPopover';
import ClipDeleteModal from './ClipDeleteModal';
import ClipNameField from './ClipNameField';

const styles = {
  Grid: {
    marginLeft: '12px',
    marginRight: '12px',
    width: '200px',
  },
  Typography: {
    maxWidth: '160px',
  },
  CircularProgress: {
    position: 'relative',
    left: '-8px',
  },
};

const ElSideControls = styled.div`
  visibility: hidden;
`;
const El = styled.div`
  cursor: pointer;
  width: 224px;
  ${({ hasAdornment }) =>
    hasAdornment
      ? `
    ${ElSideControls} {
      visibility: visible;
    }
  `
      : ''};
`;

class ClipControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isHovering: false,
      isProcessing: false,
      isDeleting: false,
      isCreating: false,
      tagName: this.props.tagName,
    };
  }

  componentDidMount() {
    this.setState({ isEditing: this.props.isCreating });
  }

  startClipRename = () => {
    this.setState({ isHovering: false, isEditing: true });
  };

  stopClipRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  tagRename = tagName => {
    this.setState({ tagName: tagName });
  };

  handleClipRename = () => {
    this.setState({ isProcessing: true, isEditing: false });
    // TODO: wire tag delete API calls
    console.group('handleClipRename()');
    console.log('tagName:', this.state.tagName);
    console.groupEnd();

    this.props.renameClip(this.state.tagName);

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startClipDelete = () => {
    this.setState({ isDeleting: true });
  };

  stopClipDelete = () => {
    this.setState({ isDeleting: false });
  };

  handleClipDelete = () => {
    this.setState({ isProcessing: true, isDeleting: false });
    // TODO: wire tag delete API calls
    console.group('handleClipDelete()');
    console.log('tagId:', this.props.tagId);
    console.groupEnd();

    this.props.deleteClip();

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startNewInstance = () => {
    // TODO: wire create new instance API calls
    console.group('startNewInstance()');
    console.log('tagId:', this.props.tagId);
    console.log('start_seconds:', this.props.currentTime);
    console.groupEnd();

    this.props.startNewInstance();
  };

  render() {
    const { classes, projectClips } = this.props;
    const { isDeleting, isEditing, isHovering, isProcessing } = this.state;

    const readMode = (
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
          <ElSideControls onClick={e => e.stopPropagation()}>
            {isProcessing ? (
              <CircularProgress
                size={18}
                className={classes.CircularProgress}
              />
            ) : (
              <ClipControlsPopover
                onStartRename={this.startClipRename}
                onStartDelete={this.startClipDelete}
              />
            )}
          </ElSideControls>
        </Grid>
      </Grid>
    );

    // const editMode = (
    //   <ClickAwayListener onClickAway={this.stopClipRename}>
    //     <TextField
    //       autoComplete="false"
    //       autoFocus
    //       className={classes.TextField}
    //       defaultValue={this.state.tagName}
    //       fullWidth
    //       onChange={e => this.setState({ tagName: e.currentTarget.value })}
    //       onKeyPress={e => {
    //         if (e.key === 'Enter') {
    //           e.preventDefault();
    //           this.handleClipRename();
    //         }
    //       }}
    //       required
    //       InputProps={{
    //         classes: {
    //           root: classes.InputRoot,
    //         },
    //         endAdornment: this.props.isCreating ? (
    //           <InputAdornment position="end">
    //             <IconButton onClick={this.props.stopNewClip}>
    //               <CloseIcon fontSize="small" />
    //             </IconButton>
    //           </InputAdornment>
    //         ) : null,
    //       }}
    //     />
    //   </ClickAwayListener>
    // );

    return (
      <El
        hasAdornment={isEditing || isHovering || isProcessing}
        onClick={!isEditing ? this.startNewInstance : null}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        {isEditing ? (
          <ClipNameField
            handleClipRename={this.handleClipRename}
            isCreating={this.props.isCreating}
            projectClips={projectClips}
            stopNewClip={this.props.stopNewClip}
            stopClipRename={this.stopClipRename}
            tagName={this.state.tagName}
            tagRename={this.tagRename}
          />
        ) : (
          readMode
        )}
        {isDeleting ? (
          <ClipDeleteModal
            handleClose={this.stopClipDelete}
            handleRemove={this.handleClipDelete}
            tagName={this.state.tagName}
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(ClipControls);
