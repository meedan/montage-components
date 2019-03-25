import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  timelineTags: {
    height: 10,
  },
  timelineHdColumn: {
    borderRight: `1px solid ${grey[300]}`,
    width: '216px',
  },
});

function TimelineTags(props) {
  const { classes } = props;
  return (
    <TableBody className={classes.timelineTags}>
      <TableRow>
        <TableCell className={classes.timelineHdColumn}>
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
      </TableRow>
    </TableBody>
  );
}

export default withStyles(styles)(TimelineTags);
