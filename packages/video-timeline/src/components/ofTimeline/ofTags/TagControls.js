import React, { Component } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TagControlsPopover from './TagControlsPopover';
import TagDeleteModal from './TagDeleteModal';
import TagNameField from './TagNameField';

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

class TagControls extends Component {
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

  startTagRename = () => {
    this.setState({ isHovering: false, isEditing: true });
  };

  stopTagRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  tagRename = tagName => {
    this.setState({ tagName: tagName });
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

    this.props.startNewInstance();
  };

  render() {
    const { classes, projectTags } = this.props;
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
              <TagControlsPopover
                onStartRename={this.startTagRename}
                onStartDelete={this.startTagDelete}
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
          <TagNameField
            handleTagRename={this.handleTagRename}
            isCreaging={this.props.isCreating}
            projectTags={projectTags}
            stopNewTag={this.stopNewTag}
            stopTagRename={this.stopTagRename}
            tagName={this.state.tagName}
            tagRename={this.tagRename}
          />
        ) : (
          readMode
        )}
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
