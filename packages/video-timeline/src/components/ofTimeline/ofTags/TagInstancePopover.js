import React, { Component } from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';

import InstanceExpandIcon from '@montage/ui/src/components/icons/InstanceExpandIcon';

class InstancePopover extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { children, choors, isHandle, onExit } = this.props;

    const renderHandlePopover = (
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
    const renderInstancePopover = (
      <>
        <Tooltip title="Match length of the video">
          <IconButton
          // onClick={expandInstance}
          >
            <InstanceExpandIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {children}
        <Tooltip title="Delete">
          <IconButton
          // onClick={deleteInstance}
          >
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
        anchorPosition={{ left: choors.x, top: choors.y }}
        anchorReference="anchorPosition"
        id="instanceControlsPopover"
        onEscapeKeyDown={onExit}
        onBackdropClick={onExit}
        open
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {isHandle ? renderHandlePopover : renderInstancePopover}
      </Popover>
    );
  }
}

export default InstancePopover;
