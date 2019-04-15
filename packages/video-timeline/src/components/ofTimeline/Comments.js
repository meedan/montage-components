import 'rc-slider/assets/index.css';
import { reduce } from 'lodash';
import React, { Component } from 'react';
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
  .rc-slider-dot {
    visibility: hidden;
  }
`;

class TimelineComments extends Component {
  state = {
    threads: this.props.data.commentThreads,
  };

  render() {
    const { currentTime, duration } = this.props;

    const getMarks = () =>
      reduce(
        this.state.threads,
        (object, param) => {
          const pos = param.start_seconds;
          object[pos] = (
            <CommentMarker {...this.props} commentData={param} key={param.id} />
          );
          return object;
        },
        {}
      );

    const toggleNewCommentThread = () => {
      const newThread = {
        isBeingAdded: true,
        start_seconds: currentTime,
        user: {
          first_name: 'Piotr',
          id: 2468,
          last_name: 'Fedorczyk',
          profile_img_url:
            'https://lh3.googleusercontent.com/-WnVd2Jl55-s/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reNETuW6ipxVS4_eHwhl1sQ0pEn6Q/s100/photo.jpg',
        },
      };
      const newThreads = [...this.state.threads, newThread];
      this.setState({ threads: newThreads });
    };
    return (
      <TableSection
        title="Comments"
        actions={
          <Tooltip title="New comment">
            <IconButton>
              <AddIcon fontSize="small" onClick={toggleNewCommentThread} />
            </IconButton>
          </Tooltip>
        }
        firstRowContent={
          <SliderWrapper>
            <Slider
              defaultValue={null}
              disabled
              included={false}
              marks={getMarks()}
              max={duration}
              min={0}
              value={null}
            />
          </SliderWrapper>
        }
      />
    );
  }
}

export default TimelineComments;
