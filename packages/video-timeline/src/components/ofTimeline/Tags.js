import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  timelineTags: {
    height: 10,
  },
});

function TimelineTags(props) {
  const { classes } = props;
  return (
    <TableHead className={classes.timelineTags}>
      <TableRow>
        <TableCell>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ width: '200px' }}
          >
            <Grid item>
              <Typography variant="subtitle2">Tags</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Play tags">
                <IconButton>
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="New tag">
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

export default withStyles(styles)(TimelineTags);
