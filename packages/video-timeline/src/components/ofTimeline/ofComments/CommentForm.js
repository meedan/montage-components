import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function CommentForm(props) {
  const { isEditing, value } = props;

  const [comment, setComment] = useState(value);

  const onCancel = () => {
    setComment(value);
    props.onCancel();
  };

  return (
    <Grid container direction="column" spacing={8} wrap="nowrap">
      <Grid item>
        <TextField
          autoFocus
          defaultValue={comment}
          fullWidth
          id="comment"
          inputProps={{
            autoComplete: 'off',
            style: { fontSize: '13px' },
          }}
          onChange={e => setComment(e.currentTarget.value)}
          placeholder={isEditing ? 'Enter comment' : 'New comment'}
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
              onClick={() => props.onSubmit(comment)}
              size="small"
            >
              {isEditing ? 'Save' : 'Reply'}
            </Button>
          </Grid>
          <Grid item>
            <Button mini onClick={onCancel} size="small">
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CommentForm;
