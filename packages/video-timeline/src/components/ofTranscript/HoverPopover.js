/** @format */

import React, { Component } from 'react';
import produce from 'immer';
import { connect } from 'react-redux';

import { CutIcon } from '@montage/ui/components';
import DeleteIcon from '@material-ui/icons/Delete';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { update } from '../../reducers/data';

const styles = theme => ({
  Popover: {
    overflow: 'visible',
    marginTop: '-20px',
  },
  EntityGrid: {
    margin: '8px',
  },
  CommentGrid: {
    margin: '4px',
  },
});

class HoverPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;

    // console.group('HoverPopover.js');
    // console.log('props:', this.props);
    // console.log('state:', this.state);
    // console.groupEnd();

    return (
      <Popover
        id={'HoverPopover'}
        open={!!this.props.isVisible}
        anchorEl={this.props.isVisible}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.Popover,
        }}>
        <Grid className={classes.CommentGrid}>
          <Tooltip title="Copy to Clips">
            <IconButton onClick={() => console.log('Copy to Clips')}>
              <CutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => console.log('Delete')}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Popover>
    );
  }
}

export default connect(
  null,
  { update }
)(withStyles(styles)(HoverPopover));
