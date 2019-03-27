import 'rc-slider/assets/index.css';
import React from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import TableBlock from './TableBlock';
import TableSection from './TableSection';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
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
    background: #b6cbe2;
    border-radius: 2px;
    height: 28px;
    position: absolute;
    top: 0;
  }
  .rc-slider-handle {
    transition: background 0.1s;
    border-radius: 2px;
    border: none;
    margin: 0;
    background: #b6cbe2;
    height: 28px;
    width: 6px;
    position: absolute;
    top: 0;
  }
  .rc-slider:hover .rc-slider-handle {
    background: #204b8d;
  }
  .rc-slider:hover .rc-slider-handle,
  .rc-slider-handle:focus {
    &:after {
      background: rgba(255, 255, 255, 0.33);
      bottom: 4px;
      content: ' ';
      display: block;
      left: 50%;
      position: absolute;
      top: 4px;
      transform: translateX(-50%);
      width: 1px;
    }
  }
`;

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

function TimelineTags(props) {
  const { data, duration } = props;
  const { videoTags } = data;
  // console.log({ videoTags });
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
                    <Range min={0} max={duration} defaultValue={arr} pushable />
                  </SliderWrapper>
                }
              />
            );
          })
        : null}
    </TableSection>
  );
}

export default TimelineTags;
