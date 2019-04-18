import React, { Component } from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
  TextField: {
    marginBottom: 0,
    marginTop: 0,
  },
  InputRoot: {
    borderBottom: `1px solid ${grey[300]}`,
    fontSize: '13px',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
};

class TagNameField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagName: this.props.tagName,
    };
  }

  componentDidMount() {
    this.setState({ isEditing: this.props.isCreating });
  }

  startTagRename = () => {
    this.setState({ isHovering: false, isEditing: true });
  };

  stopTagRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  startTagDelete = () => {
    this.setState({ isDeleting: true });
  };

  stopTagDelete = () => {
    this.setState({ isDeleting: false });
  };

  handleTagDelete = () => {
    this.setState({ isProcessing: true, isDeleting: false });
    // TODO: wire tag delete API calls
    console.group('handleTagDelete()');
    console.log('tagId:', this.props.tagId);
    console.groupEnd();
    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startNewInstance = () => {
    // TODO: wire create new instance API calls
    console.group('startNewInstance()');
    console.log('tagId:', this.props.tagId);
    console.log('start_seconds:', this.props.currentTime);
    console.groupEnd();

    this.props.startNewInstance();
  };

  render() {
    const { classes, projectTags } = this.props;

    return (
      <ClickAwayListener onClickAway={this.props.stopTagRename}>
        <TextField
          autoComplete="false"
          autoFocus
          className={classes.TextField}
          defaultValue={this.props.tagName}
          fullWidth
          onChange={e => this.props.tagRename(e.currentTarget.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.props.handleTagRename();
            }
          }}
          required
          InputProps={{
            classes: {
              root: classes.InputRoot,
            },
            endAdornment: this.props.isCreating ? (
              <InputAdornment position="end">
                <Tooltip title="Cancel">
                  <IconButton onClick={this.props.stopNewTag}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
          }}
        />
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(TagNameField);
