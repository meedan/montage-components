import { InlineDatePicker } from 'material-ui-pickers';
import { parseISO, format } from 'date-fns';
import React, { useState, useCallback, useRef } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import VideocamIcon from '@material-ui/icons/Videocam';

function RecordedDateListItem(props) {
  const { data } = props;
  const datepickerRef = useRef(null);
  const [selectedDate, handleDateChange] = useState(new Date());
  const openDatepicker = useCallback(
    e => {
      if (datepickerRef.current) {
        datepickerRef.current.open(e);
      }
    },
    [datepickerRef.current]
  );
  return (
    <>
      <ListItem button onClick={openDatepicker}>
        <ListItemIcon>
          <VideocamIcon />
        </ListItemIcon>
        <ListItemText>
          {data.gdVideoData.recorded_date_overridden ? (
            <Typography>
              Recorded{' '}
              {format(parseISO(data.gdVideoData.recorded_date), 'd MMMM YYYY', {
                awareOfUnicodeTokens: true,
              })}{' '}
              — 
              <Typography inline color="primary">
                Change?
              </Typography>
            </Typography>
          ) : (
            <Typography inline color="primary">
              Set a recorded Date
            </Typography>
          )}
        </ListItemText>
      </ListItem>
      <InlineDatePicker
        clearable
        disableFuture
        onChange={handleDateChange}
        value={selectedDate}
        ref={datepickerRef}
        TextFieldComponent="span"
      />
    </>
  );
}

export default RecordedDateListItem;
