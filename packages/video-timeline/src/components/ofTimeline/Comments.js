import 'rc-slider/assets/index.css';
import { reduce } from 'lodash';
import React from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableSection from './TableSection';
import CommentMarker from './ofComments/CommentMarker';

const SliderWrapper = styled.div`
  .rc-slider-disabled,
  .rc-slider-disabled .rc-slider-rail {
    background: transparent;
  }
  .rc-slider-disabled {
    .rc-slider-mark-text {
      cursor: pointer !important;
    }
  }
  .rc-slider-mark-text {
    height: 32px;
    width: 32px;
    transform: translateY(-27px) !important;
  }
  .rc-slider-mark-text:hover {
    z-index: 50;
  }
  .rc-slider-dot {
    visibility: hidden;
  }
`;

function TimelineComments(props) {
  const { data, duration } = props;
  const { commentThreads } = data;

  const arr = commentThreads.map(thread => {
    return thread;
  });

  const marks = reduce(
    arr,
    (object, param) => {
      const pos = param.start_seconds;
      object[pos] = (
        <CommentMarker {...props} key={param.id} commentData={param} />
      );
      return object;
    },
    {}
  );

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
      firstRowContent={
        <SliderWrapper>
          <Slider
            defaultValue={null}
            disabled
            included={false}
            marks={marks}
            max={duration}
            min={0}
            value={null}
          />
        </SliderWrapper>
      }
    />
  );
}

export default React.memo(props => TimelineComments(props));
