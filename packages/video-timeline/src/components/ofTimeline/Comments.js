import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  timelineComments: {
    height: 10,
  },
  timelineHdColumn: {
    borderRight: `1px solid ${grey[300]}`,
    width: '216px',
  },
});

function TimelineComments(props) {
  const { classes } = props;
  return (
    <TableHead className={classes.timelineComments}>
      <TableRow>
        <TableCell className={classes.timelineHdColumn}>
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
      </TableRow>
    </TableHead>
  );
}

export default withStyles(styles)(TimelineComments);
