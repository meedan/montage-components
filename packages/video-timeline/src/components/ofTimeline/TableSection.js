import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  hdCol: {
    width: '224px',
  },
  bdCol: {
    width: '100%',
  },
});

function TableSection(props) {
  const { actions, children, classes, title } = props;
  return (
    <TableBody style={{ width: '100%' }}>
      <TableRow>
        <TableCell className={classes.hdCol}>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ width: '200px' }}
          >
            <Grid item>
              <Typography variant="subtitle2">{title}</Typography>
            </Grid>
            <Grid item>{actions}</Grid>
          </Grid>
        </TableCell>
        <TableCell padding="none" className={classes.bdCol}>
          {children}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default withStyles(styles)(TableSection);
