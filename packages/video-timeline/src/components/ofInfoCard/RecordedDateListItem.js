import { DatePicker } from 'material-ui-pickers';
import { format } from 'date-fns';
import { withSnackbar } from 'notistack';
import React, { useState, useCallback, useRef } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import VideocamIcon from '@material-ui/icons/Videocam';

function RecordedDateListItem(props) {
  const { data } = props;
  const { archived_at } = data.gdVideoData;
  // const isArchived = true;
  const isArchived = archived_at !== null && archived_at !== undefined;

  const datepickerRef = useRef(null);
  const openDatepicker = useCallback(
    e => {
      if (datepickerRef.current) {
        datepickerRef.current.open(e);
      }
    },
    [datepickerRef.current]
  );

  const [recordedDate, setRecordedDate] = useState(null);

  const handleRecordedDateSet = date => {
    setRecordedDate(date);
    console.group('handleRecordedDateSet()'); // TODO: one can change the date or clear a manually set recorded date — API calls should reflect that
    console.log(`new date: ${date}`);
    console.groupEnd();
    props.enqueueSnackbar(
      date === null ? 'Recorded date unset' : 'Recorded date changed'
    );
  };

  const displayDate = recordedDate
    ? format(recordedDate, 'd MMMM YYYY', {
        awareOfUnicodeTokens: true,
      })
    : null;

  const displayRecordedDate = () => {
    if (!isArchived) {
      return displayDate /* allows Change | Revert */ ? (
        <Tooltip title="Overridden by a Montage user">
          <Typography>Recorded {displayDate}</Typography>
        </Tooltip>
      ) : (
        <Typography inline color="primary">
          Set a recorded Date
        </Typography>
      );
    } else {
      return displayDate ? (
        <Tooltip title="Overridden by a Montage user">
          <Typography>Recorded {displayDate}</Typography>
        </Tooltip>
      ) : (
        <Typography>No recorded date set</Typography>
      );
    }
  };

  return (
    <>
      <ListItem
        button={!isArchived}
        onClick={!isArchived ? openDatepicker : null}
      >
        <ListItemIcon>
          <VideocamIcon />
        </ListItemIcon>
        <ListItemText>{displayRecordedDate()}</ListItemText>
      </ListItem>
      <DatePicker
        autoOk
        clearable
        clearLabel={isArchived ? 'Revert' : 'Clear'}
        disableFuture
        onChange={date => handleRecordedDateSet(date)}
        ref={datepickerRef}
        TextFieldComponent="span"
        value={recordedDate}
      />
    </>
  );
}

export default withSnackbar(RecordedDateListItem);
