import { bool, func, string } from 'prop-types';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { parseISO, format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import React, { Component } from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';

import VideocamIcon from '@material-ui/icons/Videocam';

class RecordedDate extends Component {
  constructor(props) {
    super(props);
    this.state = { date: null, processing: null, pickerOpen: false };
    this.onAcceptDate = this.onAcceptDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  static getDerivedStateFromProps({ date }) {
    return { date };
  }

  onDateChange(newDate) {
    this.setState({ newDate });
  }

  onAcceptDate(date) {
    if (!this.props.isArchived) {
      this.setState({ processing: true, pickerOpen: false });
      this.props.onDateChange(date ? date.toISOString() : null, () =>
        this.setState({ processing: null })
      );
    }
  }

  render() {
    const { date, processing } = this.state;
    const { isArchived, isOverriden } = this.props;

    const displayDate = date
      ? format(parseISO(date), 'd MMMM YYYY', {
          awareOfUnicodeTokens: true,
        })
      : null;

    const renderDate = () => {
      if (processing) {
        return (
          <Typography variant="body2">Saving new recording date…</Typography>
        );
      }
      if (date) {
        return <Typography variant="body2">Recorded {displayDate}</Typography>;
      }
      return (
        <Typography color={isArchived ? 'initial' : 'primary'} variant="body2">
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
          {isOverriden ? (
            <Tooltip title="Overridden by a Montage user">{renderEl()}</Tooltip>
          ) : (
            renderEl()
          )}
          <DatePicker
            animateYearScrolling
            autoOk
            clearable={!!date}
            clearLabel={isArchived ? 'Revert' : 'Clear'}
            disableFuture
            onAccept={this.onAcceptDate}
            onChange={this.onDateChange}
            onClose={() => this.setState({ pickerOpen: false, newDate: null })}
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
  onDateChange: func.isRequired,
  date: string,
  isOverriden: bool,
};

RecordedDate.defaultProps = {
  isArchived: null,
  date: null,
  isOverriden: null,
};
