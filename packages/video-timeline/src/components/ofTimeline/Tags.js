import 'rc-slider/assets/index.css';
import React from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import formatTime from './formatTime';
import TableBlock from './TableBlock';
import TableSection from './TableSection';

const Range = Slider.Range;
const Handle = Slider.Handle;

const SliderWrapper = styled.div`
  .rc-slider {
    height: 28px;
  }
  .rc-slider-rail {
    height: 28px;
    background: transparent;
  }
  .rc-slider-track {
    background: rgba(71, 123, 181, 0.4);
    border-radius: 0;
    height: 28px;
    position: absolute;
    top: 0;
  }
  .rc-slider-handle {
    background: rgba(71, 123, 181, 1);
    border-radius: 1px;
    border: none;
    height: 28px;
    margin: 0;
    position: absolute;
    top: 0;
    transform: translateX(-2px);
    transition: background 0.1s;
    width: 4px;
  }
  .rc-slider:hover .rc-slider-handle {
    background: rgba(71, 123, 181, 1);
  }
  .rc-slider:hover .rc-slider-handle,
  .rc-slider-handle:focus {
    box-shadow: none;
  }
  .rc-slider-mark-text {
  }
  .rc-slider-mark-text:hover {
    z-index: 50;
  }
`;

const handle = props => {
  const { value, index, ...restProps } = props;
  return (
    <Tooltip key={index} placement="top" title={formatTime(value)}>
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

function TimelineTags(props) {
  const { data, duration } = props;
  const { videoTags } = data;

  videoTags.forEach(t => {
    t.instances = t.instances.sort((j, i) => j.start_seconds - i.start_seconds).reduce((acc = [], i) => {
      const j = acc.pop();

      if (j) {
        if (j.start_seconds <= i.start_seconds && i.start_seconds < j.end_seconds) {

          j.start_seconds = Math.min(j.start_seconds, i.start_seconds);
          j.end_seconds = Math.max(j.end_seconds, i.end_seconds);
          acc.push(j);
          return acc;
        }

        acc.push(j);
      }

      return [...acc, i];
    }, []);
  });

  return (
    <TableSection
      plain={videoTags ? videoTags.length > 0 : false}
      title="Tags"
      actions={
        <>
          <Tooltip title="Play Tags">
            <IconButton>
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New Tag">
            <IconButton>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      {videoTags
        ? videoTags.map((tag, i) => {
            const { project_tag, instances } = tag;
            const arr = [];

            instances.map(instance => {
              arr.push(instance.start_seconds);
              arr.push(instance.end_seconds);
              return null;
            });

            const trackStyle = arr.reduce((acc, j, i) => {
              return [ ...acc, { backgroundColor: i % 2 === 0 ? 'rgba(71, 123, 181, 0.4)' : 'transparent' } ];
            }, []);

            return (
              <TableBlock
                key={tag.id}
                plain={i < videoTags.length - 1}
                leftColContent={
                  <Typography
                    color="textSecondary"
                    noWrap
                    style={{ width: '160px' }}
                    variant="body2"
                  >
                    {project_tag.name}
                  </Typography>
                }
                rightColContent={
                  <SliderWrapper>
                    <Range
                      defaultValue={arr}
                      handle={handle}
                      max={duration}
                      min={0}
                      trackStyle={trackStyle}
                      pushable
                    />
                  </SliderWrapper>
                }
              />
            );
          })
        : null}
    </TableSection>
  );
}


export default React.memo((props) => TimelineTags(props));
