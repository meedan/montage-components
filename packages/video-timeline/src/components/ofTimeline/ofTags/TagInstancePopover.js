import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DeleteIcon from '@material-ui/icons/Delete';
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

const TagInstancePopover = props => {
  const {
    classes,
    id,
    instance,
    instanceEndX,
    instanceStartX,
    onExit,
    tag,
    timelineOffset,
    trackRect,
  } = props;
  if (!instance || !tag || id !== tag.id) return null;
  // Tag {id} at {x}px [{instance.start_seconds} — {instance.end_seconds}]

  const x = instanceEndX
    ? instanceStartX +
      (instanceEndX - instanceStartX) / 2 +
      224 +
      timelineOffset
    : 0;
  const y = trackRect ? trackRect.y + trackRect.height : 0;

  const expandInstance = e => {
    e.stopPropagation();
    props.onClose();
    props.expandInstance(instance);
  };
  const duplicateAsClip = e => {
    e.stopPropagation();
    props.onClose();
    props.duplicateAsClip(instance);
  };
  const deleteInstance = e => {
    e.stopPropagation();
    props.onClose();
    props.deleteInstance(instance);
  };

  return (
    <Popover
      id="instanceControlsPopover"
      open
      anchorPosition={{ left: x, top: y }}
      anchorReference="anchorPosition"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <ClickAwayListener onClickAway={props.onClose}>
        <div className={classes.Toolbar} onMouseOut={e => onExit(e)}>
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
        </div>
      </ClickAwayListener>
    </Popover>
  );
};

export default withStyles(styles)(TagInstancePopover);
