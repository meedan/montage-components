import { array, func } from 'prop-types';
import PropTypes from 'prop-types';
import Menu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindMenu } from 'material-ui-popup-state';
import React, { Component } from 'react';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';

import { withStyles } from '@material-ui/core/styles';
import { Button, Link, ClickAwayListener, Divider, Grid, ListItemText, MenuItem, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import TranslateIcon from '@material-ui/icons/Translate';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const ParentPopupState = React.createContext(null);
const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
  },
  inputRoot: {
    borderBottom: `1px solid ${grey[200]}`,
    flexWrap: 'nowrap',
    fontSize: '13px',
    marginBottom: 0,
    marginTop: 0,
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  MenuHeading: {
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
  },
});

const suggestions = [
  {
    id: 'ab',
    name: 'Abkhaz',
    nativeName: 'аҧсуа',
  },
  {
    id: 'aa',
    name: 'Afar',
    nativeName: 'Afaraf',
  },
  {
    id: 'af',
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
  },
  {
    id: 'ak',
    name: 'Akan',
    nativeName: 'Akan',
  },
  {
    id: 'sq',
    name: 'Albanian',
    nativeName: 'Shqip',
  },
  {
    id: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
  },
  {
    id: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
  },
];

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}
function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.name}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(value, suggestions = []) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep = count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

class TranslationPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { newTranslation: '', status: null };
    this.onCloseForm = this.onCloseForm.bind(this);
    this.onCreateTranslation = this.onCreateTranslation.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onOpenForm = this.onOpenForm.bind(this);
  }

  onManageDupes(popupState) {
    popupState.close();
    this.props.onManageDupes();
  }

  onDelete(popupState) {
    popupState.close();
    this.props.onDelete();
  }

  onCloseForm() {
    this.setState({ status: null, newTranslation: '' });
  }

  onOpenForm() {
    this.setState({ status: 'adding' });
  }

  onCreateTranslation() {
    this.props.onCreateTranslation(this.state.newTranslation);
    this.setState({ status: null, newTranslation: '' });
  }

  onChange = str => {
    this.setState({ name: str });
  };
  onSubmit = () => {
    this.props.onSubmit(this.state.name);
  };
  onClickAway = () => {
    if (!this.state.name || this.state.name.length === 0 || this.state.name === this.props.name) {
      this.props.onCancel();
    } else {
      this.onSubmit();
    }
  };

  render() {
    const { translations } = this.props;
    const { status } = this.state;
    const { classes, name, onCancel } = this.props;

    const form = (
      <ClickAwayListener onClickAway={this.onCloseForm}>
        <Grid container direction="column" spacing={1} wrap="nowrap">
          <Grid item>
            {' '}
            <Downshift id="downshift-tags" onInputValueChange={e => this.onChange(e)}>
              {({ getInputProps, getItemProps, getMenuProps, highlightedIndex, inputValue, isOpen, selectedItem }) => (
                <div className={classes.container}>
                  {renderInput({
                    classes,
                    fullWidth: true,
                    autoFocus: true,
                    required: true,
                    onKeyPress: e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        this.onSubmit();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        onCancel();
                      }
                    },
                    InputProps: getInputProps({
                      placeholder: name && name.length > 0 ? name : 'Enter new name…',
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Cancel">
                            <IconButton onClick={onCancel}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }),
                  })}
                  <div {...getMenuProps()}>
                    {isOpen ? (
                      <Paper className={classes.paper} square>
                        {getSuggestions(inputValue, suggestions).length > 0 ? (
                          <Typography variant="caption" color="textSecondary" className={classes.MenuHeading}>
                            In this project:
                          </Typography>
                        ) : null}
                        {getSuggestions(inputValue, suggestions).map((suggestion, index) =>
                          renderSuggestion({
                            suggestion,
                            index,
                            itemProps: getItemProps({ item: suggestion.name }),
                            highlightedIndex,
                            selectedItem,
                          })
                        )}
                      </Paper>
                    ) : null}
                  </div>
                </div>
              )}
            </Downshift>
          </Grid>
          <Grid item>
            <Grid container direction="row-reverse" justify="space-between" wrap="nowrap">
              <Grid item>
                <Button
                  color="primary"
                  disabled={this.state.newTranslation.length === 0}
                  mini
                  onClick={this.onCreateTranslation}
                  size="small"
                >
                  Create
                </Button>
              </Grid>
              <Grid item>
                <Button mini onClick={this.onCloseForm} size="small">
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ClickAwayListener>
    );

    return (
      <PopupState variant="popover" popupId="TranslationPicker">
        {popupState => (
          <>
            {translations.length > 0 ? (
              <Link {...bindHover(popupState)}>
                <TranslateIcon /> current translation
              </Link>
            ) : (
              <Link {...bindHover(popupState)}>Add translation…</Link>
            )}
            <ParentPopupState.Provider value={popupState}>
              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                disableAutoFocusItem
                getContentAnchorEl={null}
                open={status === 'adding' ? true : popupState.isOpen}
                MenuListProps={{ dense: true }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                {translations.map(translation => {
                  return (
                    <MenuItem
                      key={translation.id}
                      onClick={() => console.log(`select translation: ${translation.name}`)}
                    >
                      <ListItemText>{translation.name}</ListItemText>
                    </MenuItem>
                  );
                })}
                <Divider key="divider" />
                <MenuItem
                  button={!status}
                  onClick={!status ? this.onOpenForm : null}
                  style={{ height: 'auto' }}
                  key="newTranslation"
                >
                  <ListItemText>{status === 'adding' ? form : 'New translation…'}</ListItemText>
                </MenuItem>
              </Menu>
            </ParentPopupState.Provider>
          </>
        )}
      </PopupState>
    );
  }
}
export default withStyles(styles)(TranslationPicker);

TranslationPicker.propTypes = {
  allocation: array,
  translations: array,
  onCreateTranslation: func.isRequired,
  onDelete: func.isRequired,
  onTriggerDelete: func.isRequired,
  onManageDupes: func.isRequired,
  onUpdateAllocation: func.isRequired,
};

TranslationPicker.defaultProps = {
  allocation: [],
  translations: [
    {
      id: 'iu',
      name: 'Inuktitut',
      nativeName: 'ᐃᓄᒃᑎᑐᑦ',
    },
    {
      id: 'ja',
      name: 'Japanese',
      nativeName: '日本語 (にほんご／にっぽんご)',
    },
  ],
};
