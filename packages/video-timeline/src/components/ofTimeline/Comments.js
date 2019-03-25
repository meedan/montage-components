import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  timelineComments: {
    height: 10,
  },
});

function TimelineComments(props) {
  const { classes } = props;
  return (
    <TableHead className={classes.timelineComments}>
      <TableRow>
        <TableCell>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ width: '200px' }}
          >
            <Grid item>
              <Typography variant="subtitle2">Comments</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="New comment">
                <IconButton>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell>Content</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
}

export default withStyles(styles)(TimelineComments);
