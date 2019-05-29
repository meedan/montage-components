import { bindPopover } from "material-ui-popup-state";
import Popover from "material-ui-popup-state/HoverPopover";
import React from "react";

const InstancePopover = props => {
  return (
    <>
      <Popover
        {...bindPopover(props.popupState)}
        anchorEl={props.instanceRef}
        anchorReference="anchorEl"
        disablePortal
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
