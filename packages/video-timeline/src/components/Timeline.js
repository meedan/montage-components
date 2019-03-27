import 'rc-slider/assets/index.css';
import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
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
  z-index: 50;
  .rc-slider {
    height: 100%;
    padding: 0;
  }
  .rc-slider,
  .rc-slider-track,
  .rc-slider-rail {
    background: transparent;
  }
  .rc-slider-disabled {
    .rc-slider-mark-text {
      cursor: pointer !important;
    }
  }
`;

const TimelinePlayheadThumb = styled(({ pxOffset, position, ...props }) => (
  <div {...props} />
))`
  background: rgba(0, 0, 0, 0.033);
  cursor: col-resize;
  cursor: -webkit-grab;
  cursor: grab;
  height: 100%;
  pointer-events: all;
  position: absolute;
  touch-action: pan-x;
  transform: translateX(-50%);
  width: 13px;
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

const styles = theme => ({});

const Timeline = props => {
  const pxOffset = 224;
  const { currentTime, duration, onPause, onPlay, player } = props;

  const [time, setTime] = useState(0);
  const [skipState, setSkipState] = useState(false);

  useEffect(() => {
    if (skipState) setSkipState(false);
  }, [currentTime]);

  const onTrackClick = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = rect.left + pxOffset;
    const endPos = rect.width;
    const newPos = e.clientX - startPos;
    const newPosFlat = newPos > 0 ? newPos : 0;
    const newTime = (duration * newPosFlat) / (endPos - pxOffset);
    if (player && e.clientX > startPos) {
      setTime(Math.floor(newTime));
      setSkipState(true);
      if (!player.isPlaying) onPlay();
      if (player) player.seekTo(newTime);
    }
    return null;
  };

  const onDragStart = val => {
    setSkipState(true);
    setTime(roundTime(val));
    if (player) onPause();
  };
  const onDrag = val => {
    setSkipState(true);
    setTime(roundTime(val));
  };
  const onDragEnd = val => {
    setTime(roundTime(val));
    if (player) {
      if (player) onPlay();
      player.seekTo(roundTime(val));
    }
  };
  const getPreciseTime = () => {
    return skipState ? time : currentTime;
  };
  const roundTime = time => {
    return Math.floor(time);
  };

  return (
    <TimelinePlayheadWrapper onClick={e => onTrackClick(e)}>
      <TimelinePlayhead pxOffset={pxOffset}>
        <Slider
          defaultValue={0}
          handle={props => (
            <Tooltip title={formatTime(getPreciseTime())} placement="top">
              <TimelinePlayheadThumb style={{ left: `${props.offset}%` }} />
            </Tooltip>
          )}
          max={duration}
          min={0}
          onAfterChange={onDragEnd}
          onBeforeChange={onDragStart}
          onChange={onDrag}
          value={getPreciseTime()}
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
