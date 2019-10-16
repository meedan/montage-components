/** @format */

import React, { Component } from 'react';
import styled from 'styled-components';
import { bool, func, string } from 'prop-types';

import CheckIcon from '@material-ui/icons/Check';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import TranslateIcon from '@material-ui/icons/Translate';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core/styles';

import TranscriptContainer from './TranscriptContainer';
import TranscriptMain from './TranscriptMain';
import TranscriptSide from './TranscriptSide';
import TranscriptText from './TranscriptText';
import TranslationPicker from './TranslationPicker';
import TranscriptWrapper from './TranscriptWrapper';

const styles = theme => ({
  translateFab: {
    color: blue[500],
    // boxShadow: `inset 0 0 0 1px ${grey[200]}`,
    // '&:hover': {
    //   background: theme.palette.common.white,
    //   boxShadow: `inset 0 0 0 1px ${grey[200]}`,
    //   color: theme.palette.primary.main,
    // },
  },
  translateActiveFab: {
    color: blue[500],
    boxShadow: `inset 0 0 0 1px ${grey[200]}`,
  },
  root: {
    display: 'inline-block',
    position: 'relative',
  },
  paper: {
    alignItems: 'center',
    border: 'none',
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
});

const Element = styled.div`
  background: white;
  border-bottom: 1px solid ${grey[200]};
  flex: 0 0 ${({ pin }) => (pin ? '30px' : '50px')};
  transition: flex-basis 0.25s;
  z-index: 200;
`;

const TranscriptFabs = styled.div`
  left: -20px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
`;
const TranscriptHeading = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: ${({ pin }) => (pin ? '30px' : '50px')};
  transition: height 0.25s;
  transform: translate3d(0, 0, 0);
`;

class TranscriptToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      translationISO: null,
      searchKeyword: '',
    };
    this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  toggleSearch() {
    this.setState(
      prevState => ({
        isSearching: !prevState.isSearching,
        searchKeyword: '',
      }),
      () => {
        if (!this.state.isSearching) {
          this.props.onSearchBlur();
          this.props.onSearch('');
        }
      }
    );
  }

  onSearchFieldChange(e) {
    this.setState({ searchKeyword: e.target.value });
  }

  onSearch(e) {
    if (e) e.preventDefault();
    this.props.onSearch(this.state.searchKeyword.trim());
  }

  setTranslation = langISO => {
    this.setState({ translationISO: langISO });
  };

  render() {
    const { pin, classes } = this.props;
    return (
      <Element pin={pin}>
        <TranscriptWrapper stretch={this.props.isTranslated}>
          <TranscriptContainer>
            <TranscriptSide left></TranscriptSide>
            <TranscriptMain>
              <TranscriptText stretch={!this.props.isTranslated}>
                <TranscriptHeading pin={pin}>
                  <Typography align="left" color="textSecondary" variant="subtitle2">
                    Original Transcript
                  </Typography>
                </TranscriptHeading>
              </TranscriptText>
              {this.props.isTranslated ? (
                <TranscriptText>
                  <TranscriptHeading pin={pin}>
                    <TranslationPicker
                      createTranslation={this.props.createTranslation}
                      toggleTranslation={this.props.toggleTranslation}
                      translations={this.props.translations}
                      selectedTranslation={this.props.selectedTranslation}
                      pin={pin}
                    />
                  </TranscriptHeading>
                </TranscriptText>
              ) : null}
            </TranscriptMain>
            <TranscriptSide right>
              <TranscriptFabs>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Tooltip title="Translate">
                      <Fab
                        aria-label="Edit"
                        className={this.props.isTranslated ? classes.translateActiveFab : classes.translateFab}
                        onClick={this.props.onToggleTranslate}
                        size="small">
                        <TranslateIcon />
                      </Fab>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <div className={classes.root}>
                      <Tooltip title="Search">
                        <Fab size="small" onClick={this.toggleSearch}>
                          <SearchIcon />
                        </Fab>
                      </Tooltip>
                      {this.state.isSearching ? (
                        <ClickAwayListener onClickAway={this.toggleSearch}>
                          <Paper className={classes.paper} elevation={5}>
                            <form className={classes.form} onSubmit={this.onSearch}>
                              <InputBase
                                autoFocus
                                className={classes.input}
                                inputProps={{
                                  'aria-label': 'Search in transcript and translation',
                                }}
                                onChange={this.onSearchFieldChange}
                                placeholder="Search…"></InputBase>
                              <IconButton aria-label="Search" className={classes.iconbutton} onClick={this.onSearch}>
                                <SearchIcon />
                              </IconButton>
                            </form>
                          </Paper>
                        </ClickAwayListener>
                      ) : null}
                    </div>
                  </Grid>
                  <Grid item>
                    <Tooltip title={this.props.isEditable ? 'Save changes' : 'Edit transcript'}>
                      <Fab
                        aria-label="Edit"
                        color={this.props.isEditable ? 'primary' : null}
                        onClick={this.props.onToggleEdit}>
                        {this.props.isEditable ? <CheckIcon fontSize="large" /> : <EditIcon />}
                      </Fab>
                    </Tooltip>
                  </Grid>
                </Grid>
              </TranscriptFabs>
            </TranscriptSide>
          </TranscriptContainer>
        </TranscriptWrapper>
      </Element>
    );
  }
}

export default withStyles(styles)(TranscriptToolbar);

TranscriptToolbar.propTypes = {
  onToggleEdit: func.isRequired,
  isEditable: bool,
  isTranslated: bool,
  toggleTranslation: func.isRequired,
  selectedTranslation: string,
};

TranscriptToolbar.defaultProps = { isEditable: false, isTranslated: false, selectedTranslation: null };
