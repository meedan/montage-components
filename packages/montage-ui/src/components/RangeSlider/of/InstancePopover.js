import { bindPopover } from "material-ui-popup-state";
import { array, func, node, object, oneOfType, string } from "prop-types";
import Popover from "material-ui-popup-state/HoverPopover";
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";

import { ExpandIcon } from "@montage/ui/src/components";

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
      {props.instancePopoverChildren}
      <Tooltip title="Extend full-length">
        <IconButton onClick={props.extendInstance}>
          <ExpandIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={props.deleteInstance}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Popover>
  );
};

export default InstancePopover;

InstancePopover.propTypes = {
  deleteInstance: func.isRequired,
  extendInstance: func.isRequired,
  instancePopoverChildren: oneOfType([array, string, node]),
  popupState: object.isRequired
};

InstancePopover.defaultProps = {
  instancePopoverChildren: null
};
