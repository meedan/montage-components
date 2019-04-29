import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import InstanceExpandIcon from '@montage/ui/src/components/icons/InstanceExpandIcon';
import ContentCutIcon from '@montage/ui/src/components/icons/ContentCutIcon';

const styles = {
  Toolbar: {
    pointerEvents: 'auto',
  },
};

class TagInstancePopover extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.mousePos !== nextProps.mousePos;
  }

  render() {
    const {
      classes,
      id,
      instance,
      isOnEndHandle,
      isOnStartHandle,
      // instanceEndX,
      // instanceStartX,
      onExit,
      tag,
      timelineOffset,
      trackRect,
    } = this.props;
    if (!instance || !tag || id !== tag.id) return null;

    const getY = () => (trackRect ? trackRect.y + trackRect.height : 0);
    const getX = () => {
      if (isOnStartHandle) {
        return this.props.instanceStartX + 2 + timelineOffset;
      }
      if (isOnEndHandle) {
        return this.props.instanceEndX - 2 + timelineOffset;
      }
      return this.props.instanceEndX
        ? this.props.instanceStartX +
            (this.props.instanceEndX - this.props.instanceStartX) / 2 +
            224 +
            timelineOffset
        : 0;
    };

    const expandInstance = e => {
      e.stopPropagation();
      this.props.onExit(e);
      this.props.expandInstance(instance);
    };
    const duplicateAsClip = e => {
      e.stopPropagation();
      this.props.onExit(e);
      this.props.duplicateAsClip(instance);
    };
    const deleteInstance = e => {
      e.stopPropagation();
      this.props.onExit(e);
      this.props.deleteInstance(instance);
    };

    const handlePopover = (
      <>
        <Tooltip title="Move backward">
          <IconButton
          // onClick={expandInstance}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Move forward">
          <IconButton
          // onClick={duplicateAsClip}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );
    const instancePopover = (
      <>
        <Tooltip title="Expand to length of the video">
          <IconButton onClick={expandInstance}>
            <InstanceExpandIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy to Clips">
          <IconButton onClick={duplicateAsClip}>
            <ContentCutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete tag">
          <IconButton onClick={deleteInstance}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );

    return (
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        anchorPosition={{ left: getX(), top: getY() }}
        anchorReference="anchorPosition"
        id="instanceControlsPopover"
        onEscapeKeyDown={this.props.onClose}
        onBackdropClick={this.props.onClose}
        open
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.Toolbar} onMouseOut={onExit}>
          {isOnEndHandle || isOnStartHandle ? handlePopover : instancePopover}
        </div>
      </Popover>
    );
  }
}

export default withStyles(styles)(TagInstancePopover);
