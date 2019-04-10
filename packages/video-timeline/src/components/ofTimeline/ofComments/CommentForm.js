import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = {};

function CommentForm(props) {
  const { handleSubmit, handleCancel, isEditing, classes, value } = props;

  const [comment, setComment] = useState(value);

  const onCancel = () => {
    setComment(value);
    handleCancel();
  };
  const onSave = () => {
    handleSubmit(comment);
  };

  return (
    <Grid container direction="column" spacing={8} wrap="nowrap">
      <Grid item>
        <TextField
          autoFocus
          className={classes.commentInput}
          defaultValue={comment}
          fullWidth
          id="comment"
          inputProps={{
            autoComplete: 'off',
            style: { fontSize: '13px' },
          }}
          onChange={e => setComment(e.currentTarget.value)}
          placeholder="Enter comment"
          required
          type="text"
        />
      </Grid>
      <Grid item>
        <Grid
          container
          direction="row-reverse"
          justify="space-between"
          wrap="nowrap"
        >
          <Grid item>
            <Button
              color="primary"
              disabled={!comment || comment.length === 0}
              mini
              onClick={onSave}
              size="small"
            >
              {isEditing ? 'Save' : 'Reply'}
            </Button>
          </Grid>
          <Grid item>
            <Button mini onClick={onCancel} size="small">
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(CommentForm);
