import { Handle } from 'rc-slider';
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';

import formatTime from '../formatTime';

const styles = theme => ({
  Toolbar: {
    pointerEvents: 'auto',
  },
});

class EntityInstanceHandle extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value ? true : false;
  }
  moveBackward(e) {
    e.stopPropagation();
  }
  moveForward(e) {
    e.stopPropagation();
  }
  render() {
    const { classes, open, value } = this.props;
    return (
      <>
        <Tooltip placement="top" title={formatTime(value)} enterDelay={350}>
          <Handle {...this.props} />
        </Tooltip>
        <Popover
          number={20}
          disableEnforceFocus={false}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disableRestoreFocus
          open={open}
        >
          <div className={classes.Toolbar}>
            <Tooltip placement="bottom" title="Move backward">
              <IconButton onClick={e => this.moveBackward(e)}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" title="Move forward">
              <IconButton onClick={e => this.moveForward(e)}>
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </Popover>
      </>
    );
  }
}

export default withStyles(styles)(EntityInstanceHandle);
