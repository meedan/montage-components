import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

function TimelinePlayhead(props) {
  const { currentTime, duration, player } = props;
  const { children } = props;
  return (
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row" />
        <TableCell style={{ width: '100%' }}>
          <Range
            style={{ width: '100%' }}
            min={0}
            max={duration}
            defaultValue={[currentTime]}
            pushable
            trackStyle={[{ backgroundColor: 'transparent' }]}
            railStyle={{ backgroundColor: 'transparent' }}
            handleStyle={{
              borderColor: 'orange',
              backgroundColor: 'orange',
            }}
            onChange={([t]) => player.seekTo(t)}
          />
        </TableCell>
        <TableCell align="right" />
      </TableRow>
    </TableBody>
  );
}

export default TimelinePlayhead;
