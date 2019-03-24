import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  paper: {
    left: '50%',
    outline: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
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
      <div className={classes.paper}>
        <Card elevation="16">
          <CardContent>
            <Typography component="h2" variant="h5" gutterBottom>
              Remove video
            </Typography>
            <Typography
              component="p"
              variant="body1"
              gutterBottom
              color="textSecondary"
            >
              Do you with to remove this video from the Library? All related
              information, including tags, will be lost.
            </Typography>
          </CardContent>

          <CardActions>
            <Grid container justify="space-between">
              <Grid item>
                <Button size="large" onClick={props.handleClose}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="large"
                  color="primary"
                  onClick={props.handleRemove}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </div>
    </Modal>
  );
}

SimpleModal.propTypes = {};

// We need an intermediary variable for handling the recursive nesting.
const RemoveMediaModal = withStyles(styles)(SimpleModal);

export default RemoveMediaModal;
