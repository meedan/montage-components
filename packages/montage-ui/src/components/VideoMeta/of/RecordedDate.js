import { bool, func, string } from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { parseISO, format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React, { Component } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import VideocamIcon from "@material-ui/icons/Videocam";

class RecordedDate extends Component {
  constructor(props) {
    super(props);
    this.state = { date: null, processing: null, pickerOpen: false };
    this.onAcceptDate = this.onAcceptDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    this.setState({ date: parseISO(this.props.recDate) });
  }

  onDateChange(date) {
    console.log("onDateChange: ", date);
    this.setState({ date });
  }

  onAcceptDate(date) {
    if (this.props.isArchived) return null;
    console.log("onAcceptDate", date);
    this.setState({ processing: true, pickerOpen: false });
    this.props.onRecDateChange(date, () => this.setState({ processing: null }));
    return null;
  }

  render() {
    const { date, processing } = this.state;
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
        return <Typography>Recorded {displayDate}</Typography>;
      }
      return (
        <Typography color={isArchived ? "initial" : "primary"}>
          {isArchived ? `No recorded date set` : `Set a recorded Date`}
        </Typography>
      );
    };

    const renderEl = () => (
      <ListItem
        button={!isArchived}
        dense
        onClick={!isArchived ? () => this.setState({ pickerOpen: true }) : null}
      >
        <ListItemIcon>
          <VideocamIcon />
        </ListItemIcon>
        <ListItemText>{renderDate()}</ListItemText>
      </ListItem>
    );

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <>
          {recDateOverriden ? (
            <Tooltip title="Overridden by a Montage user">{renderEl()}</Tooltip>
          ) : (
            renderEl()
          )}
          <DatePicker
            animateYearScrolling
            autoOk
            clearable={!!recDate}
            clearLabel={isArchived ? "Revert" : "Clear"}
            disableFuture
            onAccept={this.onAcceptDate}
            // onOpen={() => this.setState({ pickerOpen: true })}
            onChange={this.onDateChange}
            // onClose={() => this.setState({ pickerOpen: false })}
            open={this.state.pickerOpen}
            TextFieldComponent="span"
            value={date || null}
            variant="dialog"
          />
        </>
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
