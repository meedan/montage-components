import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function TagDeleteModal(props) {
  const { tagName } = props;
  return (
    <Dialog
      aria-describedby="Confirm that you’re sure to remove this video from your Library"
      aria-labelledby="Delete tag"
      maxWidth="xs"
      onClose={props.handleClose}
      open
      onClick={e => e.stopPropagation()}
    >
      <DialogTitle>Delete tag</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you wish to remove all instances of <strong>{tagName}</strong>{' '}
          assigned to this video? This can’t be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button size="large" color="primary" onClick={props.handleRemove}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TagDeleteModal;
