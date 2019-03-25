import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableSection from './TableSection';

function TimelineComments(props) {
  return (
    <TableSection
      title="Comments"
      actions={
        <Tooltip title="New comment">
          <IconButton>
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      Content
    </TableSection>
  );
}

export default withStyles()(TimelineComments);
