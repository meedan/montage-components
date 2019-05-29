import { bindPopover } from "material-ui-popup-state";
import { object, string } from "prop-types";
import Popover from "material-ui-popup-state/HoverPopover";
import React from "react";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const HandlePopover = props => {
  return (
    <>
      <Popover
        {...bindPopover(props.popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        id={props.id}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Tooltip placement="bottom" title="Move backward">
          <IconButton onClick={() => console.log("<-")}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip placement="bottom" title="Move forward">
          <IconButton onClick={() => console.log("->")}>
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Popover>
    </>
  );
};

export default HandlePopover;

HandlePopover.propTypes = {
  popupState: object.isRequired,
  id: string.isRequired
};
