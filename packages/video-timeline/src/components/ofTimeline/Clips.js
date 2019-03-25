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
  timelineClips: {
    height: 10,
  },
});

function TimelineClips(props) {
  const { classes } = props;
  return (
    <TableHead className={classes.timelineClips}>
      <TableRow>
        <TableCell>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ width: '200px' }}
          >
            <Grid item>
              <Typography variant="subtitle2">Clips</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Play clips">
                <IconButton>
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="New clip">
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

export default withStyles(styles)(TimelineClips);
