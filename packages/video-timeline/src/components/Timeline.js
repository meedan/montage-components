import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import grey from '@material-ui/core/colors/grey';
import Table from '@material-ui/core/Table';
import TimelineClips from './ofTimeline/Clips';
import TimelineComments from './ofTimeline/Comments';
import TimelinePlaces from './ofTimeline/Places';
import TimelinePlayhead from './ofTimeline/Playhead';
import TimelineTags from './ofTimeline/Tags';

const Timeline = props => {
  return (
    <Table
      padding="dense"
      style={{
        borderLeft: `1px solid ${grey[300]}`,
        borderRight: `1px solid ${grey[300]}`,
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '1500px',
        minHeight: '800px',
        position: 'relative',
      }}
    >
      <TimelinePlayhead {...props} />
      <TimelineComments {...props} />
      <TimelineClips {...props} />
      <TimelineTags {...props} />
      <TimelinePlaces {...props} />
    </Table>
  );
};

export default withTheme()(Timeline);
