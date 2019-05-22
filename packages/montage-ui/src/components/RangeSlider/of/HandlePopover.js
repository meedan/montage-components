import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  BackdropRoot: {
    pointerEvents: "none"
  }
});

class HandlePopover extends Component {
  render() {
    const { classes } = this.props;
    // console.log("HandlePopover", this.props.instanceRef);
    console.log("HEREHEREH!", classes);
    return (
      <>
        <Popover
          anchorEl={this.props.instanceRef}
          anchorReference="anchorEl"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          id="HandlePopover"
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open
          BackdropProps={{
            classes: {
              root: classes.BackdropRoot
            },
            invisible: true
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
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
        <style scoped>{"#HandlePopover { pointer-events: none; }"}</style>
      </>
    );
  }
}

export default withStyles(styles)(HandlePopover);

HandlePopover.propTypes = {
  // instanceRef: ,
};
