import React from "react";
import Popover from "material-ui-popup-state/HoverPopover";
import { bindPopover } from "material-ui-popup-state";

const InstancePopover = props => {
  return (
    <>
      <Popover
        {...bindPopover(props.popupState)}
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
      >
        {props.instancePopoverChildren}
      </Popover>
    </>
  );
};

export default InstancePopover;

InstancePopover.propTypes = {
  // instancePopoverChildren: ,
  // instanceRef: ,
  // popupState: ,
};
