import { InlineDatePicker } from 'material-ui-pickers';
import { parseISO, format } from 'date-fns';
import React, { useState, useCallback, useRef } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import VideocamIcon from '@material-ui/icons/Videocam';

const RecordedDateListItem = props => {
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
    <ListItem button onClick={openDatepicker}>
      <>
        <ListItemIcon>
          <VideocamIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            data.gdVideoData.recorded_date_overridden
              ? `Recorded ${format(
                  parseISO(data.gdVideoData.recorded_date),
                  'd MMMM YYYY',
                  { awareOfUnicodeTokens: true }
                )}`
              : 'Set a recorded Date'
          }
          primaryTypographyProps={{
            variant: 'button',
            color: 'primary',
          }}
          secondary={
            <InlineDatePicker
              clearable
              disableFuture
              onChange={handleDateChange}
              value={selectedDate}
              ref={datepickerRef}
              TextFieldComponent="span"
            />
          }
        />
      </>
    </ListItem>
  );
};

export default RecordedDateListItem;
