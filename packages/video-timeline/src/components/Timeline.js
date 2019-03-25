import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TimelineClips from './ofTimeline/Clips';
import TimelineComments from './ofTimeline/Comments';
import TimelinePlaces from './ofTimeline/Places';
import TimelinePlayhead from './ofTimeline/Playhead';
import TimelineTags from './ofTimeline/Tags';

const Timeline = props => {
  return (
    <Table padding="dense">
      <TimelinePlayhead {...props} />
      <TimelineComments {...props} />
      <TimelineClips {...props} />
      <TimelineTags {...props} />
      <TimelinePlaces {...props} />
    </Table>
  );
};

export default withTheme()(Timeline);
