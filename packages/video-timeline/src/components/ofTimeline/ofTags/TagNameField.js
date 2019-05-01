import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';

import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CloseIcon from '@material-ui/icons/Close';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

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

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
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

function getSuggestions(value, projectTags = []) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : projectTags.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

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
    borderBottom: `1px solid ${grey[300]}`,
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

class TagNameField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: this.props.newTagName,
    };
  }

  render() {
    const { classes, projectTags, isCreating, oldTagName } = this.props;

    return (
      <ClickAwayListener
        onClickAway={
          isCreating ? this.props.stopNewTag : this.props.stopTagRename
        }
      >
        <Downshift
          id="downshift-tags"
          onInputValueChange={this.props.tagRename}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem,
          }) => (
            <div className={classes.container}>
              {renderInput({
                classes,
                fullWidth: true,
                autoFocus: true,
                required: true,
                onKeyPress: e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    isCreating
                      ? this.props.handleTagRename()
                      : this.props.handleTagRename();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    isCreating
                      ? this.props.stopNewTag()
                      : this.props.stopTagRename();
                  }
                },
                InputProps: getInputProps({
                  placeholder:
                    oldTagName.length > 0 ? oldTagName : 'Enter tag name…',
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Cancel">
                        <IconButton
                          onClick={
                            isCreating
                              ? this.props.stopNewTag
                              : this.props.stopTagRename
                          }
                        >
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
                    {getSuggestions(inputValue, projectTags).length > 0 ? (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className={classes.MenuHeading}
                      >
                        In this project:
                      </Typography>
                    ) : null}
                    {getSuggestions(inputValue, projectTags).map(
                      (suggestion, index) =>
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
      </ClickAwayListener>
    );
  }
}

TagNameField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TagNameField);
