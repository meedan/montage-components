import { bool, func, string } from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { parseISO, format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React, { Component, createRef } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import VideocamIcon from "@material-ui/icons/Videocam";

class RecordedDate extends Component {
  constructor(props) {
    super(props);
    this.state = { processing: null };
    this.onRecDateChange = this.onRecDateChange.bind(this);
    this.onDatepickerToggle = this.onDatepickerToggle.bind(this);
    this.datepickerRef = createRef(null);
  }

  onRecDateChange(date) {
    if (this.props.isArchived) return null;
    this.setState({ processing: true });
    this.props.onRecDateChange(date, () => this.setState({ processing: null }));
    return null;
  }

  onDatepickerToggle(e) {
    this.datepickerRef.current.open(e);
  }

  render() {
    const { processing } = this.state;
    const { isArchived, recDate, recDateOverriden } = this.props;

    const displayDate = recDate
      ? format(parseISO(recDate), "d MMMM YYYY", {
          awareOfUnicodeTokens: true
        })
      : null;

    const renderDate = () => {
      if (processing) {
        return <Typography>Saving new recording date…</Typography>;
      }
      if (recDate) {
        return recDateOverriden ? (
          <Tooltip title="Overridden by a Montage user">
            <Typography>Recorded {displayDate}</Typography>
          </Tooltip>
        ) : (
          <Typography>Recorded {displayDate}</Typography>
        );
      }
      if (!recDate) {
        return (
          <Typography color={isArchived ? "default" : "primary"}>
            {isArchived ? `No recorded date set` : `Set a recorded Date`}
          </Typography>
        );
      }
      return "ERROR";
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ListItem
          button={!isArchived}
          dense
          onClick={!isArchived ? this.onDatepickerToggle : null}
        >
          <ListItemIcon>
            <VideocamIcon />
          </ListItemIcon>
          <ListItemText>{renderDate()}</ListItemText>
        </ListItem>
        <DatePicker
          autoOk
          clearable={!!recDate}
          clearLabel={isArchived ? "Revert" : "Clear"}
          disableFuture
          onChange={this.onRecDateChange}
          ref={this.datepickerRef}
          style={{ height: "1px", width: "1px", overflow: "hidden" }}
          TextFieldComponent="span"
          value={parseISO(recDate) || null}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default RecordedDate;

RecordedDate.propTypes = {
  isArchived: bool,
  onRecDateChange: func.isRequired,
  recDate: string,
  recDateOverriden: bool
};

RecordedDate.defaultProps = {
  isArchived: null,
  recDate: null,
  recDateOverriden: null
};
