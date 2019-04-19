import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import InstanceExpandIcon from '@montage/ui/src/components/icons/InstanceExpandIcon';
import ContentCutIcon from '@montage/ui/src/components/icons/ContentCutIcon';

const styles = {
  IconButton: {
    pointerEvents: 'auto',
  },
};

const TagInstancePopover = props => {
  const { classes, id, x, y, instance, tag, onExit } = props;
  if (!instance || !tag || id !== tag.id) return null;
  // Tag {id} at {x}px [{instance.start_seconds} — {instance.end_seconds}]
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
      onExit={() => onExit()}
    >
      <Tooltip title="Expand to length of the video">
        <IconButton className={classes.IconButton}>
          <InstanceExpandIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Copy to Clips">
        <IconButton className={classes.IconButton}>
          <ContentCutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete tag">
        <IconButton className={classes.IconButton}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Popover>
  );
};

export default withStyles(styles)(TagInstancePopover);
