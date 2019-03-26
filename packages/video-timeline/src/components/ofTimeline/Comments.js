import 'rc-slider/assets/index.css';
import { reduce } from 'lodash';
import React from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableSection from './TableSection';

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
`;

const styles = {
  avatar: {
    marginTop: -27,
    height: 32,
    width: 32,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
};

function TimelineComments(props) {
  const { classes, data, duration } = props;
  const { commentThreads } = data;

  const arr = commentThreads.map(thread => {
    return thread;
  });
  const marks = reduce(
    arr,
    function(object, param) {
      const pos = (100 * param.start_seconds) / duration;
      object[pos] = (
        <Avatar
          alt={`${param.user.first_name} ${param.user.last_name}`}
          className={classes.avatar}
          onClick={e => console.log(e)}
          src={param.user.profile_img_url}
        />
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
            min={-10}
          />
        </SliderWrapper>
      }
    />
  );
}

export default withStyles(styles)(TimelineComments);
