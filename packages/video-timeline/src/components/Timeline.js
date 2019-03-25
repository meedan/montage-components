import 'rc-slider/assets/index.css';
import React from 'react';
// import Slider from 'rc-slider';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';
import Table from '@material-ui/core/Table';
import TimelineClips from './ofTimeline/Clips';
import TimelineComments from './ofTimeline/Comments';
import TimelinePlaces from './ofTimeline/Places';
import TimelineTags from './ofTimeline/Tags';

import { color } from '@montage/ui';

const TimelinePlayheadWrapper = styled.div`
  ${'' /* position: relative; */}
`;

const TimelinePlayhead = styled(({ offset, ...props }) => <div {...props} />)`
  bottom: 0;
  left: ${({ offset }) => offset + 'px'};
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
`;

const TimelineSliderThumb = styled(({ offset, ...props }) => (
  <div {...props} />
))`
  display: block;
  &:before {
    background: ${color.brand};
    border-radius: 100%;
    content: ' ';
    display: block;
    height: 9px;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translate(-50%, -50%);
    width: 9px;
  }
  &:after {
    border-left: 1px solid ${color.brand};
    content: ' ';
    display: block;
    height: 100%;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    width: 1px;
  }
`;

const styles = theme => ({
  root: {
    height: '100%',
  },
  container: {
    height: '100%',
  },
  trackBefore: {
    backgroundColor: 'transparent',
  },
  trackAfter: {
    backgroundColor: 'transparent',
  },
  thumbWrapper: {
    height: '100%',
  },
  thumbIconWrapper: {},
  thumb: {
    height: '100%',
    transform: 'translateX(-50%)',
  },
});

const Timeline = props => {
  const { currentTime, duration, player, onPlay, classes } = props;
  const offset = 224;

  const handleClick = e => {
    const rect = e.currentTarget.getBoundingClientRect();

    const startPos = rect.left + offset;
    const endPos = rect.width;
    const newPos = e.clientX - startPos;
    const newPosFlat = newPos > 0 ? newPos : 0;
    const newTime = (duration * newPosFlat) / (endPos - offset);

    // console.log('— HERE —');
    // console.log({ rect });
    // console.log({ startPos });
    // console.log({ endPos });
    // console.log({ newPos });
    // console.log({ newPosFlat });
    // console.log({ newTime });

    if (newPosFlat > 0) {
      if (!player.isPlaying) {
        onPlay();
      }
      player.seekTo(newTime);
    }
  };

  return (
    <TimelinePlayheadWrapper
      onClick={e => handleClick(e)}
      onDragStart={console.log()}
    >
      <TimelinePlayhead offset={offset}>
        <Slider
          value={[currentTime]}
          aria-labelledby="label"
          min={0}
          max={duration}
          classes={{
            container: classes.container,
            root: classes.root,
            thumb: classes.thumb,
            thumbIconWrapper: classes.thumbIconWrapper,
            thumbWrapper: classes.thumbWrapper,
            trackAfter: classes.trackAfter,
            trackBefore: classes.trackBefore,
          }}
          thumb={<TimelineSliderThumb />}
          // onChange={this.handleChange}
        />
      </TimelinePlayhead>
      <Table padding="dense">
        <TimelineComments {...props} />
        <TimelineClips {...props} />
        <TimelineTags {...props} />
        <TimelinePlaces {...props} />
      </Table>
    </TimelinePlayheadWrapper>
  );
};

export default withStyles(styles)(Timeline);
