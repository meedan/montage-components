import React, { Component } from 'react';
import { connect } from 'react-redux';

import Popover from '@material-ui/core/Popover';

import { withStyles } from '@material-ui/core/styles';

import { update } from '../../reducers/data';

const styles = theme => ({
  Popover: {
    overflow: 'visible',
  },
});
class CommentPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <Popover
        id='commentPopover'
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
        }}
      >
        Hello
      </Popover>
    );
  }
}

export default connect(
  null,
  { update }
)(withStyles(styles)(CommentPopover));
