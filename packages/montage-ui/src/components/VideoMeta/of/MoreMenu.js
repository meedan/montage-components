import { array, bool, func } from 'prop-types';
import { includes } from 'lodash';
import Menu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindMenu } from 'material-ui-popup-state';
import React, { Component } from 'react';

import {
  Button,
  ClickAwayListener,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ChevronRight from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const ParentPopupState = React.createContext(null);

const submenuStyles = theme => ({
  menu: {
    top: -theme.spacing,
  },
  moreArrow: {
    marginRight: theme.spacing(-1),
  },
});

const Submenu = withStyles(submenuStyles)(
  ({ classes, title, popupId, children, ...props }) => (
    <ParentPopupState.Consumer>
      {parentPopupState => (
        <PopupState
          variant="popover"
          popupId={popupId}
          parentPopupState={parentPopupState}
        >
          {popupState => (
            <ParentPopupState.Provider value={popupState}>
              <MenuItem {...bindHover(popupState)} selected={popupState.isOpen}>
                <ListItemText>{title}</ListItemText>
                <ChevronRight className={classes.moreArrow} />
              </MenuItem>
              <Menu
                {...bindMenu(popupState)}
                {...props}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                className={classes.menu}
                disableAutoFocusItem
                getContentAnchorEl={null}
                MenuListProps={{ dense: true }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                {children}
              </Menu>
            </ParentPopupState.Provider>
          )}
        </PopupState>
      )}
    </ParentPopupState.Consumer>
  )
);

class MoreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { newName: '', status: null };
    this.addTo = this.addTo.bind(this);
    this.onCloseForm = this.onCloseForm.bind(this);
    this.onCreateNewCollection = this.onCreateNewCollection.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onManageDupes = this.onManageDupes.bind(this);
    this.onOpenForm = this.onOpenForm.bind(this);
    this.removeFrom = this.removeFrom.bind(this);
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
    this.setState({ status: null, newName: '' });
  }

  onOpenForm() {
    this.setState({ status: 'adding' });
  }

  onCreateNewCollection() {
    this.props.onCreateCollection(this.state.newName);
    this.setState({ status: null, newName: '' });
  }

  removeFrom(id) {
    const { allocation } = this.props;
    const i = allocation.indexOf(id);
    if (i > -1) {
      allocation.splice(i, 1);
      this.props.onUpdateAllocation(allocation);
    }
  }

  addTo(id) {
    const { allocation } = this.props;
    const newArr = [...allocation, id];
    this.props.onUpdateAllocation(newArr);
  }

  render() {
    const { isArchived, collections, allocation } = this.props;
    const { status } = this.state;

    const form = (
      <ClickAwayListener onClickAway={this.onCloseForm}>
        <Grid container direction="column" spacing={1} wrap="nowrap">
          <Grid item>
            <TextField
              autoFocus
              fullWidth
              id="newName"
              inputProps={{
                autoComplete: 'off',
              }}
              label="New collection…"
              placeholder="Enter name"
              required
              type="text"
              onChange={e =>
                this.setState({
                  newName: e.currentTarget.value,
                })
              }
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  this.onCreateNewCollection();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  this.onCloseForm();
                }
              }}
            />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row-reverse"
              justify="space-between"
              wrap="nowrap"
            >
              <Grid item>
                <Button
                  color="primary"
                  disabled={this.state.newName.length === 0}
                  mini
                  onClick={this.onCreateNewCollection}
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
      <PopupState variant="popover" popupId="moreMenu">
        {popupState => (
          <>
            <IconButton {...bindHover(popupState)}>
              <MoreVertIcon />
            </IconButton>
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
                {!isArchived
                  ? [
                      <Submenu
                        disableAutoFocusItem
                        open={
                          status === 'adding'
                            ? true
                            : popupState._childPopupState
                        }
                        popupId="allocationPopover"
                        title="Add to collection…"
                        key="allocationPopover"
                      >
                        {collections && collections.length > 0
                          ? collections.map(collection => {
                              const { name, id } = collection;
                              const isAllocated = includes(allocation, id);
                              return (
                                <MenuItem
                                  key={id}
                                  onClick={() =>
                                    isAllocated
                                      ? this.removeFrom(id)
                                      : this.addTo(id)
                                  }
                                >
                                  <ListItemIcon>
                                    {isAllocated ? (
                                      <CheckBoxIcon fontSize="small" />
                                    ) : (
                                      <CheckBoxOutlineBlankIcon fontSize="small" />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText>{name}</ListItemText>
                                </MenuItem>
                              );
                            })
                          : null}
                        {collections && collections.length > 0 ? (
                          <Divider key="allocationPopoverDivider" />
                        ) : null}
                        <MenuItem
                          button={!status}
                          onClick={!status ? this.onOpenForm : null}
                          style={{ height: 'auto' }}
                          key="newCollectionItem"
                        >
                          <ListItemText>
                            {status === 'adding' ? form : `New Collection`}
                          </ListItemText>
                        </MenuItem>
                      </Submenu>,
                      <MenuItem
                        onClick={() => this.onManageDupes(popupState)}
                        key="manageDupesItem"
                      >
                        <ListItemText>Manage duplicates</ListItemText>
                      </MenuItem>,
                      <Divider key="divider" />,
                    ]
                  : null}
                <MenuItem onClick={() => this.onDelete(popupState)}>
                  <ListItemText>Remove from Library</ListItemText>
                </MenuItem>
              </Menu>
            </ParentPopupState.Provider>
          </>
        )}
      </PopupState>
    );
  }
}
export default MoreMenu;

MoreMenu.propTypes = {
  allocation: array,
  collections: array,
  isArchived: bool,
  onCreateCollection: func.isRequired,
  onDelete: func.isRequired,
  onTriggerDelete: func.isRequired,
  onManageDupes: func.isRequired,
  onUpdateAllocation: func.isRequired,
};

MoreMenu.defaultProps = {
  allocation: [],
  collections: [],
  isArchived: false,
};
