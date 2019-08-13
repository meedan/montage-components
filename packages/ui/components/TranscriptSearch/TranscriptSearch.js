import React, { Component } from 'react';
import { func } from 'prop-types';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'inline-block',
    position: 'relative',
  },
  paper: {
    alignItems: 'center',
    display: 'flex',
    padding: '2px 4px',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '256px',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  iconbutton: {
    padding: 10,
  },
};

class TranscriptSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasField: false,
      keyword: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.toggleField = this.toggleField.bind(this);
  }

  toggleField() {
    this.setState(
      prevState => ({
        hasField: !prevState.hasField,
        keyword: '',
      }),
      () => {
        if (!this.state.hasField) {
          this.props.onBlur();
          this.props.onSearch('');
        }
      }
    );
  }

  onChange(e) {
    this.setState({ keyword: e.target.value });
  }

  onSearch(e) {
    if (e) e.preventDefault();
    this.props.onSearch(this.state.keyword.trim());
  }

  render() {
    const { classes } = this.props;
    const {} = this.state;

    return (
      <div className={classes.root}>
        <Fab size="small" onClick={this.toggleField}>
          <SearchIcon />
        </Fab>
        {this.state.hasField ? (
          <ClickAwayListener onClickAway={this.toggleField}>
            <Paper className={classes.paper} elevation={5}>
              <form className={classes.form} onSubmit={this.onSearch}>
                <InputBase
                  autoFocus
                  className={classes.input}
                  inputProps={{
                    'aria-label': 'Search in transcript and translation',
                  }}
                  onChange={this.onChange}
                  placeholder="Search…"
                ></InputBase>
                <IconButton
                  aria-label="Search"
                  className={classes.iconbutton}
                  onClick={this.onSearch}
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </Paper>
          </ClickAwayListener>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(TranscriptSearch);

TranscriptSearch.propTypes = {
  onBlur: func.isRequired,
  onSearch: func.isRequired,
};
TranscriptSearch.defaultProps = {};
