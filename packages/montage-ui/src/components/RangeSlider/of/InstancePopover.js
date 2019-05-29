import { bindPopover } from "material-ui-popup-state";
import Popover from "material-ui-popup-state/HoverPopover";
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { CutIcon, ExpandIcon } from "@montage/ui/src/components";

const InstancePopover = props => {
  return (
    <Popover
      {...bindPopover(props.popupState)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      id="InstancePopover"
      transformOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
    >
      <Tooltip title="Copy to Clips">
        <IconButton>
          <CutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {props.instancePopoverChildren}
      <Tooltip title="Expand to full-length">
        <IconButton>
          <ExpandIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Popover>
  );
};

export default InstancePopover;

InstancePopover.propTypes = {
  // instancePopoverChildren: ,
  // instanceRef: ,
  // popupState: ,
};
