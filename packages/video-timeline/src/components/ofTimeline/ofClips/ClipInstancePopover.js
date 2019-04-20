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

const ClipInstancePopover = props => {
  const { classes, id, x, y, instance, clip, onExit } = props;
  if (!instance || !clip || id !== clip.id) return null;
  // Clip {id} at {x}px [{instance.start_seconds} — {instance.end_seconds}]

  const expandInstance = e => {
    e.stopPropagation();
    props.expandInstance(instance);
  };
  const duplicateAsClip = e => {
    e.stopPropagation();
    props.expandInstance(instance);
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
        <Tooltip title="Delete clip">
          <IconButton onClick={deleteInstance}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </Popover>
  );
};

export default withStyles(styles)(ClipInstancePopover);
