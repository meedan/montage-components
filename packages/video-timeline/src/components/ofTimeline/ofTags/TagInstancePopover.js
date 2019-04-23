import React from 'react';

import { withStyles } from '@material-ui/core/styles';
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
    tag,
    trackRect,
    onExit,
  } = props;
  if (!instance || !tag || id !== tag.id) return null;
  // Tag {id} at {x}px [{instance.start_seconds} — {instance.end_seconds}]

  const x = instanceEndX
    ? instanceStartX + (instanceEndX - instanceStartX) / 2 + 224
    : 0;
  const y = trackRect ? trackRect.y + trackRect.height : 0;

  console.group('coors');
  console.log('props.instanceEndX', props.instanceEndX);
  console.log('props.instanceStartX', props.instanceStartX);
  console.log(x, y);
  console.groupEnd();

  const expandInstance = e => {
    e.stopPropagation();
    props.expandInstance(instance);
  };
  const duplicateAsClip = e => {
    e.stopPropagation();
    props.duplicateAsClip(instance);
  };
  const deleteInstance = e => {
    e.stopPropagation();
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
    </Popover>
  );
};

export default withStyles(styles)(TagInstancePopover);
