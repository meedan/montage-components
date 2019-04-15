import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function RemoveModal(props) {
  return (
    <Dialog
      aria-describedby="Confirm that you’re sure to remove this video from your Library"
      aria-labelledby="Remove video"
      onClose={props.handleClose}
      open
    >
      <DialogTitle>Remove video</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you with to remove this video from the Library? All related
          information, including tags, will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button size="large" color="primary" onClick={props.handleRemove}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveModal;
