import { shape, number } from 'prop-types';
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';

import InstanceExpandIcon from '@montage/ui/src/components/icons/InstanceExpandIcon';

const styles = theme => ({
  Toolbar: {
    pointerEvents: 'auto',
  },
});

class EntityInstancePopover extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.anchorPosition.left !== this.props.anchorPosition.left &&
      prevProps.isOverHandle !== this.props.isOverHandle
    ) {
      this.props.onExit();
    }
  }

  render() {
    const {
      classes,
      children,
      anchorPosition,
      instance,
      isOverHandle,
      onDelete,
      onExit,
      onExtend,
      entity,
      entityId,
    } = this.props;

    if (!entity || !instance || entity.id !== entityId) return null;

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
    const trackPopover = (
      <>
        <Tooltip title="Match length of the video">
          <IconButton onClick={onExtend}>
            <InstanceExpandIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {children}
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
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
        anchorPosition={anchorPosition}
        anchorReference="anchorPosition"
        disableAutoFocus
        disableEnforceFocus
        disablePortal
        disableRestoreFocus
        id="instanceControlsPopover"
        onBackdropClick={onExit}
        onEscapeKeyDown={onExit}
        open
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.Toolbar} onClick={e => e.stopPropagation()}>
          {isOverHandle ? handlePopover : trackPopover}
        </div>
      </Popover>
    );
  }
}

export default withStyles(styles)(EntityInstancePopover);

EntityInstancePopover.defaultProps = {
  anchorPosition: { left: 0, top: 0 },
}

EntityInstancePopover.propTypes = {
  anchorPosition: shape({
    left: number,
    top: number,
  }),
}
