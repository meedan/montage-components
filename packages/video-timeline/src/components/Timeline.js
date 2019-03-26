import 'rc-slider/assets/index.css';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';
import Table from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';

import TimelineClips from './ofTimeline/Clips';
import TimelineComments from './ofTimeline/Comments';
import TimelinePlaces from './ofTimeline/Places';
import TimelineTags from './ofTimeline/Tags';

import { color } from '@montage/ui';

const TimelinePlayheadWrapper = styled.div``;

function formatTime(timeInSeconds) {
  var pad = function(num, size) {
      return ('000' + num).slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60);

  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}

const TimelinePlayhead = styled(({ pxOffset, ...props }) => <div {...props} />)`
  bottom: 0;
  left: ${({ pxOffset }) => pxOffset + 'px'};
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
`;

const TimelineSliderThumb = styled(({ pxOffset, ...props }) => (
  <div {...props} />
))`
  bottom: 0;
  display: block;
  height: 100% !important;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100% !important;
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
    cursor: 'ew-resize',
    pointerEvents: 'all',
    '&:hover, &:active': {
      boxShadow: 'none',
    },
  },
});

const Timeline = props => {
  const pxOffset = 224;
  const { currentTime, duration, player, onPlay, classes } = props;

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (player) {
      if (player.player.isPlaying) setTime(currentTime);
    }
  }, [currentTime]);

  useEffect(() => {
    if (player) {
      if (!player.player.isPlaying) onPlay();
      player.seekTo(time);
    }
  }, [time]);

  const onTrackClick = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = rect.left + pxOffset;
    const endPos = rect.width;
    const newPos = e.clientX - startPos;
    const newPosFlat = newPos > 0 ? newPos : 0;
    const newTime = (duration * newPosFlat) / (endPos - pxOffset);
    setTime(newTime);
  };
  const onThumbDrag = (e, val) => {
    setTime(val);
  };

  return (
    <TimelinePlayheadWrapper onClick={e => onTrackClick(e)}>
      <TimelinePlayhead pxOffset={pxOffset}>
        <Slider
          defaultValue={currentTime}
          value={time}
          aria-labelledby="Playback progress"
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
          thumb={
            <Tooltip title={formatTime(time)} placement="top">
              <TimelineSliderThumb />
            </Tooltip>
          }
          onChange={(e, val) => onThumbDrag(e, val)}
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
