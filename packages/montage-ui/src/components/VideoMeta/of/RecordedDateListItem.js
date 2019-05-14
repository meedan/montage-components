import { bool, func } from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React, { useState, useCallback, useRef } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import VideocamIcon from "@material-ui/icons/Videocam";

function RecordedDateListItem(props) {
  const { callback, isArchived } = props;

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
    console.groupEnd();
    callback(date);
    // props.enqueueSnackbar(
    //   date === null ? "Recorded date unset" : "Recorded date changed"
    // );
  };

  const displayDate = recordedDate
    ? format(recordedDate, "d MMMM YYYY", {
        awareOfUnicodeTokens: true
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
    }
    return displayDate ? (
      <Tooltip title="Overridden by a Montage user">
        <Typography>Recorded {displayDate}</Typography>
      </Tooltip>
    ) : (
      <Typography>No recorded date set</Typography>
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ListItem
        button={!isArchived}
        dense
        onClick={!isArchived ? openDatepicker : null}
      >
        <ListItemIcon>
          <VideocamIcon />
        </ListItemIcon>
        <ListItemText>{displayRecordedDate()}</ListItemText>
      </ListItem>
      <DatePicker
        autoOk
        clearable={!!recordedDate}
        clearLabel={isArchived ? "Revert" : "Clear"}
        disableFuture
        onChange={date => handleRecordedDateSet(date)}
        ref={datepickerRef}
        style={{ height: "1px", width: "1px", overflow: "hidden" }}
        TextFieldComponent="span"
        value={recordedDate}
      />
    </MuiPickersUtilsProvider>
  );
}

export default RecordedDateListItem;

RecordedDateListItem.propTypes = {
  callback: func.isRequired,
  isArchived: bool
};

RecordedDateListItem.defaultProps = {
  isArchived: null
};
