import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  leftCol: {
    width: '224px',
  },
  rightCol: {
    width: '100%',
  },
});

function TableBlock(props) {
  const { classes, leftColContent, rightColContent } = props;
  return (
    <TableRow>
      <TableCell className={classes.leftCol}>{leftColContent}</TableCell>
      <TableCell className={classes.rightCol} padding="none">
        {rightColContent}
      </TableCell>
    </TableRow>
  );
}

export default withStyles(styles)(TableBlock);
