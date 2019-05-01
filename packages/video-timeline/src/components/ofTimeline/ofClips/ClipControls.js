import React, { Component } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ClipControlsPopover from './ClipControlsPopover';
import EntityDeleteModal from '../EntityDeleteModal';
import EntityNameField from '../EntityNameField';

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
      isCreating: false,
      isDeleting: false,
      isEditing: false,
      isHovering: false,
      isProcessing: false,
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

  handleClipRename = name => {
    this.setState({ isProcessing: true, isEditing: false });
    // TODO: wire tag delete API calls
    console.group('handleClipRename()');
    console.log('name:', name);
    console.groupEnd();
    this.props.renameClip(name);

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
    console.log('clipId:', this.props.clipId);
    console.groupEnd();

    this.props.deleteClip();

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startNewInstance = () => {
    // TODO: wire create new instance API calls
    console.group('startNewInstance()');
    console.log('clipId:', this.props.clipId);
    console.log('start_seconds:', this.props.currentTime);
    console.groupEnd();

    this.props.startNewInstance();
  };

  render() {
    const { classes, isCreating, projectClips } = this.props;
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
          <Tooltip title={this.props.clipName} enterDelay={750}>
            <Typography
              className={classes.Typography}
              color="textSecondary"
              noWrap
              variant="body2"
            >
              {this.props.clipName}
            </Typography>
          </Tooltip>
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

    return (
      <El
        hasAdornment={isEditing || isHovering || isProcessing}
        onClick={!isEditing ? this.startNewInstance : null}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        {isEditing ? (
          <EntityNameField
            name={this.props.clipName}
            onCancel={isCreating ? this.props.stopNewClip : this.stopClipRename}
            onSubmit={this.handleClipRename}
            suggestions={projectClips}
          />
        ) : (
          readMode
        )}
        {isDeleting ? (
          <EntityDeleteModal
            name={this.props.clipName}
            onCancel={this.stopClipDelete}
            onConfirm={this.handleClipDelete}
            title="Delete clip"
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(ClipControls);
