import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TimelineClips from './ofTimeline/Clips';
import TimelineComments from './ofTimeline/Comments';
import TimelinePlaces from './ofTimeline/Places';
import TimelinePlayhead from './ofTimeline/Playhead';
import TimelineTags from './ofTimeline/Tags';

const Timeline = props => {
  const { duration, player, onPlay } = props;

  const handleClick = e => {
    const rect = e.target.getBoundingClientRect();
    const furthestPos = rect.width;
    const selectedPos = e.clientX - rect.left;
    const newCurrentTime = (duration * selectedPos) / furthestPos;
    if (!player.isPlaying) {
      onPlay();
    }
    player.seekTo(newCurrentTime);
  };

  return (
    <Table padding="dense" onClick={e => handleClick(e)}>
      <TimelinePlayhead {...props} />
      <TimelineComments {...props} />
      <TimelineClips {...props} />
      <TimelineTags {...props} />
      <TimelinePlaces {...props} />
    </Table>
  );
};

export default withTheme()(Timeline);
