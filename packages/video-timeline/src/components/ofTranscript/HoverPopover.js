/** @format */

import React, { Component } from 'react';
// import produce from 'immer';
import { connect } from 'react-redux';

import { CutIcon } from '@montage/ui/components';
import DeleteIcon from '@material-ui/icons/Delete';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { update } from '../../reducers/data';

const styles = theme => ({
  Popper: {
    overflow: 'visible',
    zIndex: 100,
  },
  Grid: {
    padding: '4px',
  },
});

class HoverPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;

    console.group('HoverPopover.js');
    console.log('props:', this.props);
    console.log('state:', this.state);
    console.groupEnd();

    return (
      <>
        <Popper
          id={'HoverPopover'}
          className={classes.Popper}
          open={!!this.props.isVisible}
          anchorEl={this.props.isVisible}
          placement="top">
          <ClickAwayListener onClickAway={this.props.onClose}>
            <Paper elevation={3}>
              <Grid className={classes.Grid}>
                <Tooltip title="Copy to Clips">
                  <IconButton onClick={() => this.props.copyToClips(this.props)}>
                    <CutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => this.props.deleteInstance(this.props)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </>
    );
  }
}

export default connect(
  null,
  { update }
)(withStyles(styles)(HoverPopover));
