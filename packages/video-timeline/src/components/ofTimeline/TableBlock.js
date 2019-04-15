import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  className: {},
  leftCol: {
    width: '224px',
    paddingLeft: 0,
    paddingRight: 0,
  },
  rightCol: {
    width: '100%',
  },
  plain: {
    border: 'none',
  },
});

function TableBlock(props) {
  const { classes, leftColContent, rightColContent } = props;
  return (
    <TableRow>
      <TableCell
        className={`${classes.leftCol} ${props.plain ? classes.plain : null}`}
      >
        {leftColContent}
      </TableCell>
      <TableCell
        className={`${classes.rightCol} ${props.plain ? classes.plain : null}`}
        padding="none"
      >
        {rightColContent}
      </TableCell>
    </TableRow>
  );
}

export default withStyles(styles)(TableBlock);
