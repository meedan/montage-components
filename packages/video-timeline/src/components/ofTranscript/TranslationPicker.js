import { array, func } from 'prop-types';
import Menu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindMenu } from 'material-ui-popup-state';
import React, { Component } from 'react';
import map from 'lodash/map';

import { withStyles } from '@material-ui/core/styles';
import { Button, Link, ClickAwayListener, Divider, Grid, ListItemText, MenuItem } from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';
import Select from '@material-ui/core/Select';

import languages from './languages';

const ParentPopupState = React.createContext(null);
const styles = theme => ({
  select: {
    width: '180px',
  },
});

class TranslationPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { newTranslation: null, status: null };
    this.onCloseForm = this.onCloseForm.bind(this);
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
    this.setState({ status: null, newTranslation: null });
  }

  onOpenForm() {
    this.setState({ status: 'adding' });
  }

  onCreateTranslation = () => {
    console.log('onCreateTranslation()', this.state.newTranslation);
    this.props.createTranslation(this.state.newTranslation);
    this.setState({ status: null, newTranslation: null });
  };

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
    const { classes, translations } = this.props;
    const { status } = this.state;

    const form = (
      <ClickAwayListener onClickAway={this.onCloseForm}>
        <Grid container direction="column" spacing={1} wrap="nowrap">
          <Grid item>
            <Select
              className={classes.select}
              native
              value={this.state.newTranslation}
              onChange={event => this.setState({ newTranslation: event.target.value })}
              inputProps={{
                name: 'language',
                id: 'translation-language',
              }}
            >
              <option value="" disabled selected>
                Select language…
              </option>
              {map(languages, o => (
                <option value={o.id}>{o.name}</option>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Grid container direction="row-reverse" justify="space-between" wrap="nowrap">
              <Grid item>
                <Button
                  color="primary"
                  disabled={!this.state.newTranslation}
                  mini
                  onClick={this.onCreateTranslation}
                  size="small"
                >
                  Add
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
              <Link {...bindHover(popupState)}>Enable translation…</Link>
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
                {translations.length > 0
                  ? translations.map(translation => {
                      return (
                        <MenuItem
                          key={languages[translation].id}
                          onClick={() => this.props.toggleTranslation(languages[translation].id)}
                        >
                          <ListItemText>{languages[translation].name}</ListItemText>
                        </MenuItem>
                      );
                    })
                  : null}
                {translations.length > 0 ? <Divider key="divider" /> : null}

                <MenuItem
                  button={!status}
                  onClick={!status ? this.onOpenForm : null}
                  style={{ height: 'auto' }}
                  key="newTranslation"
                  className={status === 'adding' ? classes.addingNewTranslation : classes.newTranslation}
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
  createTranslation: func.isRequired,
  toggleTranslation: func.isRequired,
  translations: array,
};

TranslationPicker.defaultProps = {
  translations: null,
};
