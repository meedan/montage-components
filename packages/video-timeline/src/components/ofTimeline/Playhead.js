import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { color } from '@montage/ui';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const styles = theme => ({
  timelinePlayhead: {
    height: 10,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: '0',
    width: '100%',
    zIndex: 10,
  },
  timelineHdColumn: {
    minWidth: '224px',
    width: '15%',
  },
  timelinePlayheadControls: {
    width: '85%',
  },
});

function TimelinePlayhead(props) {
  const { currentTime, duration } = props;
  const { classes } = props;

  return (
    <TableBody className={classes.timelinePlayhead}>
      <TableRow>
        <TableCell
          className={classes.timelineHdColumn}
          component="th"
          scope="row"
        />
        <TableCell
          className={classes.timelinePlayheadControls}
          component="th"
          padding="none"
        >
          <Range
            style={{ width: '100%', minHeight: '800px', height: '100%' }}
            min={0}
            max={duration}
            defaultValue={[currentTime]}
            value={[currentTime]}
            pushable
            trackStyle={[{ backgroundColor: 'transparent' }]}
            railStyle={{ backgroundColor: 'transparent' }}
            handleStyle={{
              backgroundColor: color.brand,
              borderColor: color.brand,
              height: '10px',
              marginLeft: '-5px',
              marginTop: '-5px',
              width: '10px',
              top: '0',
            }}
          />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default withStyles(styles)(TimelinePlayhead);
