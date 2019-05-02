import React, { Component } from 'react';
import styled from 'styled-components';
import Popover from 'material-ui-popup-state/HoverPopover';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import EntityDeleteModal from './EntityDeleteModal';
import EntityNameField from './EntityNameField';

function renderControlsPopover(onStartRename, onStartDelete) {
  return (
    <PopupState variant="popover" popupId="moreTagOptionsPopover">
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

class EntityControls extends Component {
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

  startRename = () => {
    this.setState({ isHovering: false, isEditing: true });
  };

  stopRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  handleRename = name => {
    this.setState({ isProcessing: true, isEditing: false });
    // TODO: wire tag delete API calls
    console.group('handleRename()');
    console.log('tagName:', name);
    console.groupEnd();

    this.props.renameEntity(name);

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
    console.log('tagId:', this.props.entityId);
    console.groupEnd();

    this.props.deleteEntity();

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startNewInstance = () => {
    // TODO: wire create new instance API calls
    console.group('startNewInstance()');
    console.log('tagId:', this.props.entityId);
    console.log('start_seconds:', this.props.currentTime);
    console.groupEnd();

    this.props.startNewInstance();
  };

  render() {
    const {
      classes,
      isCreating,
      suggestions,
      entityName,
      stopNewEntity,
    } = this.props;
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
          <Tooltip title={entityName} enterDelay={750}>
            <Typography
              className={classes.Typography}
              color="textSecondary"
              noWrap
              variant="body2"
            >
              {entityName}
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
              renderControlsPopover(this.startRename, this.startTagDelete)
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
            name={entityName}
            onCancel={isCreating ? stopNewEntity : this.stopRename}
            onSubmit={this.handleRename}
            suggestions={suggestions}
          />
        ) : (
          readMode
        )}
        {isDeleting ? (
          <EntityDeleteModal
            name={entityName}
            onCancel={this.stopTagDelete}
            onConfirm={this.handleTagDelete}
            title="Delete tag"
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(EntityControls);
