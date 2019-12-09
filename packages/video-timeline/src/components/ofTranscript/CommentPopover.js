/** @format */

import React, { Component } from 'react';

import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';

import CommentThread from '../ofTimeline/ofComments/CommentThread';

const styles = theme => ({
  Popover: {
    overflow: 'visible',
    marginTop: '-20px',
  },
});
class CommentPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, commentData } = this.props;
    return (
      <Popover
        id="commentPopover"
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
        <CommentThread
          closePopup={this.props.onClose}
          commentData={commentData}
          isActionable={this.props.isActionable}
        />
      </Popover>
    );
  }
}

export default withStyles(styles)(CommentPopover);
