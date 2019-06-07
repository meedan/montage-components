import { func } from "prop-types";
import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

function RemoveModal({ handleClose, handleRemove }) {
  return (
    <Dialog
      aria-describedby="Confirm that you’re sure to remove this video from your Library"
      aria-labelledby="Remove video"
      maxWidth="xs"
      onClose={handleClose}
      open
    >
      <DialogTitle>Remove video</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you wish to remove this video from the Library? All related
          information, including tags, will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="large" color="primary" onClick={handleRemove}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveModal;

RemoveModal.propTypes = {
  handleRemove: func.isRequired,
  handleClose: func.isRequired
};
