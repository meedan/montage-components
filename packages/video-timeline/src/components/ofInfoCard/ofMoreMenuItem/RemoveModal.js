import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    left: '50%',
    outline: 'none',
    padding: theme.spacing.unit * 4,
    position: 'absolute',
    top: '50%',
    transform: 'transition(-50%, -50%)',
    width: theme.spacing.unit * 50,
  },
});

function SimpleModal(props) {
  const { classes } = props;
  return (
    <Modal
      aria-labelledby="Remove video"
      aria-describedby="Confirm that you’re sure to remove this video from your Library"
      open
      onClose={() => props.handleClose}
    >
      <div style={getModalStyle()} className={classes.paper}>
        <Typography variant="h6" id="modal-title">
          Remove video
        </Typography>
        <Typography variant="subtitle1" id="simple-modal-description">
          Are sure you wish to remove this video from the Library?
        </Typography>
      </div>
    </Modal>
  );
}

SimpleModal.propTypes = {};

// We need an intermediary variable for handling the recursive nesting.
const RemoveMediaModal = withStyles(styles)(SimpleModal);

export default RemoveMediaModal;
