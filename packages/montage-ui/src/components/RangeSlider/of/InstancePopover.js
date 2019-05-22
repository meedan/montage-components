import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";

const styles = theme => ({
  BackdropRoot: {
    pointerEvents: "none"
  }
});

const InstancePopover = props => {
  // console.log("InstancePopover", props.instanceRef);
  const { classes } = props;
  return (
    <>
      <Popover
        anchorEl={props.instanceRef}
        anchorReference="anchorEl"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        id="InstancePopover"
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
        Instance Popover
      </Popover>
      <style scoped>{"#InstancePopover { pointer-events: none; }"}</style>
    </>
  );
};

export default withStyles(styles)(InstancePopover);

InstancePopover.propTypes = {
  // instanceRef: ,
};
